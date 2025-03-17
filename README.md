# AI-Driven-Predictive-Modelling-for-Student-Performance

## How to Run
Step 1:   
Create a file: public/config.json   
Inside it:
{
    "apiKey": "your-api-key",
    "authDomain": "your-auth-domain",
    "projectId": "your-project-id",
    "storageBucket": "your-storage-bucket",
    "messagingSenderId": "your-messaging-sender-id",
    "appId": "your-app-id"
}   

### Warning: Ensure .gitignore includes config.json to prevent leaks!

Step 2:   
sh```
npm install -g firebase-tools
```
sh```
firebase emulators:start --only hosting
```

Optionally - if you are using your own API key:
sh```
firebase deploy
```
