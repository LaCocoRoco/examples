interface Config {
    firebase: Firebase;
}

interface Firebase {
    apiKey:            string;
    appId:             string;
    projectId:         string;
    authDomain:        string;
    databaseURL:       string;
    storageBucket:     string;
    messagingSenderId: string;
    measurementId:     string;
}
