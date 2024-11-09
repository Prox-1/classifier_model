import eel
import torch
import base64
import io
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
from Net_class import Net, classes

eel.init('web')
resnet = models.resnet18(weights='DEFAULT')
resnet.fc = nn.Linear(resnet.fc.in_features, 10) 
resnet.load_state_dict(torch.load("models/cifar_net_resnet.pth", weights_only=True))
resnet.eval()
resnet_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

net = Net()
net.load_state_dict(torch.load("models/cifar_net_1_new_amsgrad.pth", weights_only=True))
net.eval()
net_transform = transforms.Compose([
    transforms.Resize((64, 64)),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

def model_selection(model_name):
    if model_name == 'resnet':
        return resnet, resnet_transform
    elif model_name == 'net':
        return net, net_transform

def load_image_from_file(file_content):
    header, encoded = file_content.split(',', 1)
    data = base64.b64decode(encoded)
    img = Image.open(io.BytesIO(data)).convert('RGB')
    return img

def transform_image(img, transform):
    return transform(img)

def predict_class(img_t, model):
    with torch.no_grad():
        class_probabilities = model(img_t.unsqueeze(0))
        pred = torch.argmax(class_probabilities, 1)
    return pred, class_probabilities

def tensor_to_base64(img_t):
    denormalized_tensor = (img_t * 255).byte()
    denormalized_tensor = denormalized_tensor.permute(1, 2, 0)
    image = Image.fromarray(denormalized_tensor.numpy())
    
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
    return img_str

def normalize_and_reverse_probabilities(probabilities):
    if not probabilities:
        return []
    min_prob = min(probabilities)
    if min_prob < 0:
        probabilities = [p - min_prob for p in probabilities]
    total = sum(probabilities)
    if total == 0:
        return [0] * len(probabilities)
    percentages = [(p / total) * 100 for p in probabilities]
    return percentages


@eel.expose
def make_pred(file_content, model_name):
    img = load_image_from_file(file_content)
    model, transform = model_selection(model_name) 
    img_t = transform_image(img, transform)  
    pred, class_probabilities = predict_class(img_t, model)  
    
    class_probabilities = normalize_and_reverse_probabilities(class_probabilities.squeeze().tolist())  

    return [int(pred), class_probabilities]

eel.start('main.html', size=(800, 700))