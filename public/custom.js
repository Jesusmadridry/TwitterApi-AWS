window.onload = function(){
    console.log('On load Script');
    
    // const isProfile = isProfile();
    if(isProfile()){
        // console.log('Is profile Page');
        localStorage.removeItem("created");
        const alert = document.querySelector("#alert");
        const setScreenName = document.querySelector('#screenName');
        const setFirstName = document.querySelector('#firstName');
        const setLastName = document.querySelector('#lastName');
        const setdescriptionUser = document.querySelector('#descriptionUser');
        const tweetsButton = document.querySelector('#tweetsButton');
        const profileButton = document.querySelector('#profileButton');
        const editButton = document.querySelector('#editButton');
        const updateButton = document.querySelector('#updateButton');
        const tweetsPanel = document.querySelector('#tweets');
        const profilePanel = document.querySelector('#profile');
        const editPanel = document.querySelector('#edit');
        const updateFirstName  = document.querySelector('#updateFirstName'); 
        const updateLastName = document.querySelector('#updateLastName');
        const updatePathImage = document.querySelector('#updatePathImage');
        const updateDescription = document.querySelector('#updateDescription');
        const user = localStorage.getItem('userInfo');
        const descriptions = (localStorage.getItem('descriptions')).split(",");
        

        const {
                firstName,
                lastName,
                descriptionUser,
                pathImage,
                screenName,
              } = JSON.parse(user) ;
        // console.log("userName: ", firstName+" "+lastName);
        // console.log("screenName: ", screenName);
        // console.log("descriptionUser: ", descriptionUser);
        // console.log("descriptions: ", descriptions)
        
        setScreenName.innerHTML = `@${screenName}`;
        setdescriptionUser.innerHTML = descriptionUser;
        setFirstName.textContent += `${firstName}`;
        setLastName.textContent += `${lastName}`;
        
        tweetsButton.onclick = (event) => {
            // console.log("tweetsButton");
            const created = localStorage.getItem('created');
            event.preventDefault();
            hideShowPanel({
                           option: "tweets", 
                           twitter:tweetsPanel,
                           profile:profilePanel,
                           edit:editPanel,
                         })
            if(created == undefined){
                for(let i=0; i<5;i++){
                    createTweetContainer({
                        description:descriptions[i],
                        screenName:screenName,
                    });
                }
                localStorage.setItem('created', 'true');
            } 
        }
        
        profileButton.onclick = (event) => {
            // console.log("profileButton");
            event.preventDefault();
            hideShowPanel({
                           option: "profile", 
                           twitter:tweetsPanel,
                           profile:profilePanel,
                           edit:editPanel,
                         })
        }
        editButton.onclick = (event) => {
            // console.log("editButton");
            event.preventDefault();
            hideShowPanel({
                           option: "edit", 
                           twitter:tweetsPanel,
                           profile:profilePanel,
                           edit:editPanel,
                         })
            updateFirstName.value = firstName;
            updateLastName.value = lastName;
            updatePathImage.value = pathImage;
            updateDescription.value = descriptionUser;
            
        }
        updateButton.onclick = () => {
            console.log("updateButton");
            const currentFirstName = updateFirstName.value;
            const currentLastName = updateLastName.value;
            const currentPathImage = updatePathImage.value;
            const currentDescription = updateDescription.value;

            // console.log("currentFirstName", currentFirstName);
            // console.log("currentLastName", currentLastName);
            // console.log("currentPathImage", currentPathImage);
            // console.log("currentDescription", currentDescription);
            if(
                currentFirstName.trim() !== '' &&
                currentLastName.trim() !== '' &&
                currentPathImage.trim() !== '' &&
                currentDescription.trim() !== '' 
            ){
                const updateURL = "http://localhost:5000/users/update";
                const params = {
                    screenName : screenName.toLowerCase(),
                    firstName : currentFirstName,
                    lastName : currentLastName,
                    description : currentDescription,
                    pathImage : currentPathImage,
                }
                const options = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params),
                };
                fetch(updateURL, options)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    const { err } = data;
                    if(!err){
                        updateFirstName.value = currentFirstName;
                        updateLastName.value = currentLastName;
                        updatePathImage.value = currentPathImage;
                        updateDescription.value = currentDescription;
                        const userInfo = {
                            firstName: currentFirstName,
                            lastName: currentLastName,
                            descriptionUser:currentDescription,
                            pathImage: currentPathImage,
                            screenName: screenName,
                        }
                        localStorage.setItem('userInfo', JSON.stringify(userInfo));
                        hideShowAlert({
                            alert: alert, 
                            hide: false,
                            text: "User info updated",
                            option: "success",
                        });
                        setTimeout(() => {  
                            hideShowAlert({
                                alert: alert, 
                                hide: true,
                                text: "",
                                option: "success",
                            });
                        }, 3000);
                    } else {
                        hideShowAlert({
                            alert: alert, 
                            hide: false,
                            text: "Error tring to update",
                            option: "warning",
                        });
                        setTimeout(() => {  
                            hideShowAlert({
                                alert: alert, 
                                hide: true,
                                text: "",
                                option: "warning",
                            });
                        }, 3000);
                    }
                });
            } else {
                hideShowAlert({
                    alert: alert, 
                    hide: false,
                    text: "Please fill in all fields ",
                    option: "warning",
                });
                setTimeout(() => {  
                    hideShowAlert({
                        alert: alert, 
                        hide: true,
                        text: "",
                        option: "warning",
                    });
                }, 3000);
            }
        }
    } else {
        console.log('Is not profile Page');
        const buttonSearch = document.querySelector('#searchUser');
        buttonSearch.onclick = async (event) => {
            event.preventDefault();
            // console.log('onclick detected')
            const screenName = (document.querySelector('#screenName').value).toLowerCase();
            const alert = document.querySelector('#alert');
            // console.log('screenName: ', screenName);
    
            if(screenName.trim() !== ''){
                const UrlTwitter = `http://localhost:5000/getTweets/${screenName}`;
                const UrlDB = `http://localhost:5000/users/${screenName}`;
                fetch(UrlDB)
                .then(res => res.json())
                .then((user) => {
                    // console.log("User information: ", user);
                    if(Object.keys(user).length !== 0){
                        fetch(UrlTwitter)
                        .then(res => res.json())
                        .then((tweets) => {
                            const { error } = tweets;
                            if(!error){
                                hideShowAlert({
                                    alert: alert, 
                                    hide: false,
                                    text: "User finded...Redirecting",
                                    option: "success",
                                });
                                setTimeout(() => {  
                                    hideShowAlert({
                                        alert: alert, 
                                        hide: true,
                                        text: "",
                                        option: "success",
                                    });
                                }, 3000);
                                const firstName = user.Item.name ;  const lastName = user.Item.last_name;
                                const fullName = firstName + " " + lastName;
                                const descriptionUser = user.Item.description;
                                const pathImage = user.Item.path_image;
                                // console.log("pathImage: ", pathImage);
                                // console.log("Fullname: ", fullName)
                                // console.log("User description: ", descriptionUser);
                                // console.log(tweets);
                                const screenName = tweets[0].user.screen_name;
                                // console.log("@", screenName);
                                let descriptions = [];
                                for(let i=0; i<5; i++){ //alterar par foreach
                                    // console.log("Twit #", i+1);
                                    // console.log("Twit description: ", tweets[i].text);
                                    descriptions.push(tweets[i].text);
                                }
                                const userInfo = {
                                    firstName: firstName,
                                    lastName: lastName,
                                    descriptionUser:descriptionUser,
                                    pathImage: pathImage,
                                    screenName: screenName,
                                }
                                localStorage.setItem('descriptions', descriptions);
                                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                                setTimeout(() => {
                                    window.location.href = "http://localhost:5000/profile"
                                }, 3000)
                                ;
                                
                            } else {
                                hideShowAlert({
                                    alert: alert, 
                                    hide: false,
                                    text: "User not finded",
                                    option: "warning",
                                });
                                setTimeout(() => {  
                                    hideShowAlert({
                                        alert: alert, 
                                        hide: true,
                                        text: "",
                                        option: "warning",
                                    });
                                }, 3000);
                            }
                        })
                    } else{
                        hideShowAlert({
                                        alert: alert, 
                                        hide: false,
                                        text: "User not finded",
                                        option: "warning",
                                    });
                        setTimeout(() => {  
                            hideShowAlert({
                                alert: alert, 
                                hide: true,
                                text: "",
                                option: "warning",
                            });
                        }, 3000);
                    }
                })
            } else {
                hideShowAlert({
                    alert: alert, 
                    hide: false,
                    text: "Fill the field",
                    option: "warning",
                });
                setTimeout(() => {  
                    hideShowAlert({
                        alert: alert, 
                        hide: true,
                        text: "",
                        option: "warning",
                    });
                }, 3000);
            }
        }
    }
    const hideShowAlert = (params) => {
        const {hide, alert, text, option} = params;
        alert.innerHTML = text;
        
        if(option == "warning"){
            (alert.className).includes("alert alert-success hide") 
            ? alert.classList.remove('alert', 'alert-success', 'hide') 
            : "";
            alert.classList.add('alert', 'alert-warning', 'hide') 
        } else {
            (alert.className).includes("alert alert-warning hide") 
            ? alert.classList.remove('alert','alert-warning', 'hide') 
            : "";
            alert.classList.add('alert', 'alert-success', 'hide') 
        }
        if(hide){
            alert.classList.remove('show'); 
            alert.classList.add('hide');  
        } else {
            alert.classList.remove('hide'); 
            alert.classList.add('show');
        }
    }
    const hideShowPanel = (params) => {
        const {option , twitter, profile, edit} = params;
        if(option == 'tweets'){
            twitter.style.display = "block";
            profile.style.display = "none";
            edit.style.display = "none";
        } else if(option == 'profile'){
            profile.style.display = "block";
            twitter.style.display = "none";
            edit.style.display = "none";
        } else {
            edit.style.display = "block";
            twitter.style.display = "none";
            profile.style.display = "none";
        }
    }
    
    const createTweetContainer = (params) => {
        const { description, screenName } = params;
        const tweetsContainer = document.querySelector("#tweets");
        const tweetContainer = document.createElement("div");
        const tweetScreen = document.createElement("div");
        const tweetDescription = document.createElement("div");
        tweetContainer.classList = "tweet-container";
        tweetScreen.innerHTML = screenName;
        tweetDescription.innerHTML = description;

        tweetContainer.appendChild(tweetScreen);
        tweetContainer.appendChild(tweetDescription);
        tweetsContainer.appendChild(tweetContainer);

    }
}
const isProfile = () => {
        const currentUrl = window.location.href;
        // console.log(currentUrl);
        const isProfile = currentUrl.includes("/profile") ? true : false;
        // console.log(isProfile);
        return isProfile;
}