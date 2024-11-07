import eel
import torch
import base64
import io
from PIL import Image
import torchvision.transforms as transforms
from Net_class import Net, classes

eel.init('web')
net = Net()
net.load_state_dict(torch.load("cifar_net_1_new.pth", weights_only=True))
net.eval()

my_data_transform = transforms.Compose([
    transforms.Resize((64, 64)),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

def load_image_from_file(file_content):
    header, encoded = file_content.split(',', 1)
    data = base64.b64decode(encoded)
    img = Image.open(io.BytesIO(data)).convert('RGB')
    return img

def transform_image(img):
    return my_data_transform(img)

def predict_class(img_t):
    with torch.no_grad():
        class_probabilities = net(img_t.unsqueeze(0))
        pred = torch.argmax(class_probabilities)
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
    positive_probabilities = [-p for p in probabilities]
    min_prob = min(positive_probabilities)
    max_prob = max(positive_probabilities)
    adjusted_probabilities = [(max_prob - (p - min_prob)) for p in positive_probabilities]
    total_adjusted = sum(adjusted_probabilities)
    normalized = [(p / total_adjusted) * 100 for p in adjusted_probabilities]

    return normalized


@eel.expose
def make_pred(file_content):
    img = load_image_from_file(file_content) 
    img_t = transform_image(img)  
    pred, class_probabilities = predict_class(img_t)  
    
    class_probabilities = normalize_and_reverse_probabilities(class_probabilities.squeeze().tolist())  

    return [int(pred), class_probabilities]

eel.start('main.html', size=(700, 700))