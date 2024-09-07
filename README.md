# Proposal Generator
 Uses an AI model to generate Business Proposals at the user's request

#How to run the program

First, make an account at https://cohere.com/ and create an API key
Next, Open 2 instances of the command prompt

#Running the Backend

1.) Make your way to the backend folder in the first instance of the command prompt (cd "copy path")

2.) Create a virtual environment by entering the command 'Python -m venv venv' which will make an environment called venv

3.) To activate the virtual environment run 'venv\Scripts\activate'

4.) Now to download all the required libraries, run the command 'pip install -r requirements.txt'

5.) In main.py, on line 24 where it says "insert_key_here", replace the text with your cohere API key

5.) When that is finished, to finally run the backend, run the command 'uvicorn main:app --reload'

#Running the Frontend

1.) To run the frontend, all you need to do first is make your way to the frontend folder in the command prompt
 
2.) Now all you do is run the command 'npm install' and then 'npm start'

3.) This should open the application in your browser

Now you can enter a topic and description and the program will run and generate a business proposal!!
