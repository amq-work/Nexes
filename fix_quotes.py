import os

directory = 'd:\\Personal\\Digital_Nexes_Website'
for file in os.listdir(directory):
    if file.endswith('.html') or file.endswith('.js') or file.endswith('.cjs'):
        filepath = os.path.join(directory, file)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content.replace(r'href=\"', 'href="')
        new_content = new_content.replace(r'\"', '"')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
for file in ['src/main.js', 'src/whatsapp.js']:
    filepath = os.path.join(directory, file)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = content.replace(r'href=\"', 'href="')
        new_content = new_content.replace(r'\"', '"')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
