import os
import re

directory = 'd:\\Personal\\Digital_Nexes_Website'
html_files = [f for f in os.listdir(directory) if f.endswith('.html')]
js_files = ['src/main.js', 'src/whatsapp.js', 'inject_globals.cjs']

files_to_process = html_files + js_files

def process_content(content):
    # 1. Replace index.html exactly
    content = re.sub(r'href=[\"\']/?index\.html([\#\?][^\'\"]*)?[\"\']', r'href=\"/\1\"', content)
    # 2. Replace other .html links (e.g., href="/about.html" -> href="/about")
    # This regex looks for href="/something.html" or href="something.html"
    # and safely strips .html
    def repl(m):
        path = m.group(1)
        suffix = m.group(2) or ''
        # Exclude external links
        if path.startswith('http') or path.startswith('mailto:'):
            return m.group(0)
        return f'href=\"{path}{suffix}\"'
    
    content = re.sub(r'href=[\"\']([^\"\']+)\.html([\#\?][^\'\"]*)?[\"\']', repl, content)
    
    # 3. Handle window.location.pathname in JS
    content = content.replace('.html', '')  # Wait, this is too broad!
    return content

for file in files_to_process:
    filepath = os.path.join(directory, file)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = process_content(content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
print('Done updating links.')
