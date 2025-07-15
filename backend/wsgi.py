import os
import sys
from pathlib import Path

# Добавляем путь к проекту в sys.path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from main import app

# Для совместимости с WSGI серверами
application = app 