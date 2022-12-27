# Nottify

A simple music app for android devices built with react-native

## Features

- User authentication
- Load songs from the device
- Play / Pause / Stop / Next / Previous / Shuffle / Loop / Time navigate
- Remember the last played song from the previous run
- Playlist: Add / Remove / Play / Pause songs from playlist
- Search and play online songs
- Background playback


## Local Deployment

* You need to run the BE to deploy this app https://github.com/kwanuwu/MusicPlayerServer
 
* First, you have to go to src/misc/services and change const ip = "your local ip"

* To run this app locally, clone the project, navigate to the root directory with a command prompt or terminal(where the package.json file is located), and run this below code to download the neccesary dependencies onto your local machine (You can use npm instead of yarn).

```
    yarn install
    or
    npm install
```


* Inside the root directory, you can run this built-in command to start the application:
```
    yarn start
```
* Run the app in the development mode. Open http://localhost:19002 to view it in the browser, you can use Android devices or web browser to deploy the project.

## Libraries and Framework

* `react-native`
* `expo`
* `expo-av`
* `expo-media-library`
* `react-native-async-storage`
* `react-native-permission`
* `recyclerlistview`

## Contributors

* [Nguyễn Việt Quân](https://github.com/kwanuwu)
* [Trần Đức Hiếu](https://github.com/duchieu1279)

## Screenshots

* Login/Register

    ![a289daa8a9697137287814](https://user-images.githubusercontent.com/91016349/209673205-64bc8e9c-cbf1-4eb7-98e8-1e7a4c382b4a.jpg)
    ![5c21117062b1baefe3a011](https://user-images.githubusercontent.com/91016349/209673298-0a3dfee4-574d-4982-931b-ab7570ddc10c.jpg)
    
* Albums
   
    ![bb632d485e8986d7df9812](https://user-images.githubusercontent.com/91016349/209673527-2fdef7b9-041c-4df8-b919-886f93ddc9a0.jpg)
    
* Online songs

    ![8e69054c768daed3f79c13](https://user-images.githubusercontent.com/91016349/209673441-a71d9d23-c46d-4abe-b54f-34ccac7f14e7.jpg)
    ![c9ef17ad646cbc32e57d9](https://user-images.githubusercontent.com/91016349/209673653-464b47d6-8c86-428c-8f28-94c1d9cc5cff.jpg)
    
* Play/Pause/Next/Previous/Suffle

    ![e78ca2cad10b0955501a8](https://user-images.githubusercontent.com/91016349/209673714-3991b721-f34b-47c0-b284-65854497389c.jpg)

* Playlist
  
    ![3d88d205a2c47a9a23d56](https://user-images.githubusercontent.com/91016349/209674045-af26851d-cf39-4122-a155-23b8e0deae4f.jpg)
    
* Play in playlist

    ![b1fe8f37fff627a87ee73](https://user-images.githubusercontent.com/91016349/209673834-cda3147d-9ee3-4a4a-869d-466f14259940.jpg)
    ![f80c25f755368d68d4272](https://user-images.githubusercontent.com/91016349/209673843-93f1938b-ae01-4be2-9e2e-055bcf5b9661.jpg)
    
* Logout

    ![08d3f5d885195d4704081](https://user-images.githubusercontent.com/91016349/209674199-b8586a79-c3e4-433e-9dad-aeaee84f0ef3.jpg)
