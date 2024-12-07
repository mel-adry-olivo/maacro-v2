# **Project Setup Guide**

## **1. Install Python**

### Steps to Install Python:

1. Go to the official Python website: [https://www.python.org/downloads/](https://www.python.org/downloads/).
2. Click the big yellow button that says **Download Python [version number]**.
3. When the download finishes, open the file (double-click it).
4. In the installer:
   - **Check the box** that says **Add Python to PATH** (this is VERY important!).
   - Click the button that says **Install Now**.
5. Wait for the installation to complete.
6. Once installed, close the installer.

## **2. Install XAMPP and Enable Apache**

### Steps to Install XAMPP:

1. Go to the official XAMPP website: [https://www.apachefriends.org/download.html](https://www.apachefriends.org/download.html).
2. Download the version for your operating system (Windows, macOS, or Linux).
3. Once the download finishes, open the file (double-click it).
4. Follow the installation steps and install XAMPP.
5. After installation, open the **XAMPP Control Panel** (it should open automatically).
6. In the XAMPP Control Panel, find the **Apache** module and click **Start** to turn it on.

## **3. Add the Project Folder to XAMPP's `htdocs` Directory**

### What is the `htdocs` Directory?

The `htdocs` folder is where you put all the project files so XAMPP can find and serve them to your browser.

### Steps to Add the Project Folder:

1. Locate the folder where XAMPP was installed (usually `C:\xampp`).
2. Open the folder named `htdocs` inside the XAMPP folder (`C:\xampp\htdocs`).
3. Copy the project folder (e.g., `maacro-v2`) into the `htdocs` folder.
   - The path to your project should now look like this:  
     `C:\xampp\htdocs\maacro-v2`.

## **4. Open a Terminal**

### Steps to Open a Terminal:

1. If you're using **Visual Studio Code**:
   - Open the project folder in VSCode.
   - Go to the top menu, click **View**, then click **Terminal**.
2. If you're using Command Prompt:
   - Press `Win + R` on your keyboard, type `cmd`, and press Enter.

## **5. Navigate to the `api` Directory**

### Steps to Navigate:

1. In your terminal, type the following command:
   ```bash
   cd C:\xampp\htdocs\maacro-v2\api
   ```
   - This tells the terminal to go to the `api` folder inside your project.
2. Press Enter.

## **6. Set Up a Virtual Environment**

### Steps to Create and Activate a Virtual Environment:

1. **Create a virtual environment:**  
   In the terminal, type:
   ```bash
   python -m venv venv
   ```
   - This creates a folder named `venv` in your project directory.
2. **Activate the virtual environment:**
   - If you're on Windows, type:
     ```bash
     venv\Scripts\activate
     ```
   - If you're on macOS/Linux, type:
     ```bash
     source venv/bin/activate
     ```
   - You’ll know it’s activated because your terminal will show `(venv)` before your commands.

## **7. Install Python Dependencies**

### Steps to Install Dependencies:

1. While your virtual environment is activated, type:
   ```bash
   pip install -r requirements.txt
   ```
2. Press Enter.
3. Wait for all the packages to install (you'll see a lot of text on the screen).

## **8. Run the Project on Your Browser**

### Steps to Run the Project:

1. Open your browser (e.g., Chrome, Firefox).
2. Type the following in the address bar:
   ```
   http://localhost/maacro-v2
   ```
3. Press Enter.
4. You should see the project running in your browser! 🎉
