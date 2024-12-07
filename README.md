# Project Setup Guide

Follow the steps below to set up the project on your local machine:

---

## 1. Install Python

- Download and install Python from the official website: [https://www.python.org/downloads/](https://www.python.org/downloads/).
- **Important:** During installation, ensure you check the option **"Add Python to environment variables"**.

---

## 2. Install XAMPP and Enable Apache

- Download and install XAMPP from: [https://www.apachefriends.org/download.html](https://www.apachefriends.org/download.html).
- After installation, open XAMPP Control Panel and start the **Apache** module.

---

## 3. Add the Project Folder to XAMPP's `htdocs`

- Move or copy the project folder into the `htdocs` directory located at:  
  `C:\xampp\htdocs`

---

## 4. Open a Terminal

- You can use the terminal in **Visual Studio Code (VSCode)** or the Command Prompt (`cmd`).

---

## 5. Navigate to the `api` Directory

- Use the `cd` command to change the directory to the `api` folder of the project:
  ```bash
  cd C:\xampp\htdocs\maacro-v2\api
  ```

---

## 6. Set Up a Virtual Environment

- Create a virtual environment:z
  ```bash
  python -m venv venv
  ```
- Activate the virtual environment:
  - On **Windows**:
    ```bash
    venv\Scripts\activate.bat
    ```

---

## 7. Install Python Dependencies

- While the virtual environment is active, install the required dependencies:
  ```bash
  pip install -r requirements.txt
  ```

---

## 8. Launch the Project in a Browser

- Open your browser and navigate to:  
  [http://localhost/maacro-v2](http://localhost/maacro-v2)
