var iframe = "";

window.onload = (event) => {

    var username = ""; 
    iframe = document.getElementById('login_banner');

    console.log("popup 1");
   
    var username  = getCookie('username'); 
    if ( username )
    {
    }
    else {
       username = "" + randomString(10) + "".toLowerCase();
       setCookie('username',username,1);
    }   
    
    try {
    document.getElementById('loginx').style.display = "block";
    } catch (error) { }

    var img = document.getElementById('login_banner');

   runstartgame();


   var xx = "";
   var yy = "";
   var extensionxxyy = "";

   setTimeout(() => {
        fetchstatus();
   }, "5000");


};




function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString.toLowerCase();
}



function httpgetx(dataxxx, server){

    xhr2 = new XMLHttpRequest();
    xhr2.open('GET', 'https://www.onworks.net/runos/security.php?username=' + dataxxx + '&service=' + server, true);
    xhr2.onload = function (e) {
       if (xhr2.status === 200) {
            //console.log(xhr2.responseText);
            runningx = xhr2.responseText;
            if ( runningx.indexOf("runX") != -1 )
            {
                console.log("User running");
            }
            else {
                console.log("User not running");
                window.location = "https://www.onworks.net/onworkssession.php";
            }
        }
        else {
            //console.error(xhr2.statusText);
	    console.log("Error 1");
	    console.log(xhr2);
	    //window.location = "https://www.onworks.net/onworkssession.php";
        }
    };
    xhr2.onerror = function (e) {
	console.log("Error 2");
         console.error(xhr2.statusText);
    };
    xhr2.send();


    setTimeout(function() {

		var xhr = new XMLHttpRequest();
                xhr.open('GET', "https://www.onworks.net/community/user.php?username=" + dataxxx + '&service=' + server, true);
                xhr.send();
                httpgetx(dataxxx, server);
    }, 30000);
}



function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/; domain=www.onworks.net";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


function $_GET(param) {
        var vars = {};
        window.location.href.replace( location.hash, '' ).replace(
                /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
                function( m, key, value ) { // callback
                        vars[key] = value !== undefined ? value : '';
                }
        );

        if ( param ) {
                return vars[param] ? vars[param] : null;
        }
        return vars;
}


function getWidthX() {
	return document.documentElement.clientWidth;

        //return Math.min(
         //       document.body.scrollWidth,
       //         document.documentElement.scrollWidth,
        //        document.body.offsetWidth,
        //        document.documentElement.offsetWidth,
         //       document.documentElement.clientWidth
        //);
}

function getHeightX() {

	 return document.documentElement.clientHeight;

         //return Math.min(
          //      document.body.scrollHeight,
           //     document.documentElement.scrollHeight,
         //       document.body.offsetHeight,
          //      document.documentElement.offsetHeight,
         //       document.documentElement.clientHeight
        //);
}


var counterxx = 10;
function rewritebutton (xx) {
	document.getElementById("talpa-splash-button").style.fontSize = "70px";
        document.getElementById("talpa-splash-button").innerHTML = "Please wait " + xx + " secs";
        if ( counterxx > 0 )
        {
                setTimeout(() => {
                        counterxx = counterxx - 1;
                        rewritebutton (counterxx);
                }, "1000");
        }
        else {
                document.getElementById("talpa-splash-button").innerHTML = "Enter";
		document.getElementById("talpa-splash-button").style.fontSize = "40px;"
		document.getElementById("talpa-splash-button").disabled = false;

		document.getElementById("preparing").innerHTML = "Ready!! Click Enter";
                document.getElementById("preparing").classList.remove("move-horizontal");
                document.getElementById("preparing").classList.add("remove-animation");
                document.getElementById("talpa-splash-button").style.background = "#1b771b";
        }
}



function runstartgame() {

        var xhr1 = new XMLHttpRequest();
        if ( getCookie("os") )  {
                xhr1.open('GET', "https://www.onworks.net/playonline/startgame2b.php?os=" + getCookie("os"), true);
        } else {
                xhr1.open('GET', "https://www.onworks.net/playonline/startgame2b.php?os=ubuntu-20.04.1-desktop&home=init", true);
        }
        xhr1.onload = function (e) {
                if (xhr1.readyState === 4) {
                        if (xhr1.status === 200) {
                                var response1 = xhr1.responseText;
                                document.getElementById('loginx').innerHTML = response1;

				var iii22 = 'width:320px;height:100px';
				var iDiv = document.createElement('div');
				iDiv.id = 'smallbanner';
				document.getElementById('talpa-splash-button').after(iDiv);
                                //postscribe(iDiv, iii22);

				var iii4 = '<script> var ttt = document.getElementById(\'talpa-splash-container-id\'); ';
				iii4 = iii4 + ' if ( getWidthX()  > 0 )  { ';
				iii4 = iii4 + ' ttt.style.left = "0px";';
                                iii4 = iii4 + '  } <\/script>';

				postscribe(iDiv, iii4 );


				document.getElementById("talpa-splash-button").disabled = true;

				setTimeout(() => {
        				counterxx = counterxx - 1;
        				rewritebutton (counterxx);
				}, "1000"); 
				


                        } else {
                                console.error(xhr1.statusText);
                        }
                 }
        };
        xhr1.onerror = function (e) {
                console.error(xhr1.statusText);
        };
        xhr1.send();

}


var viendolovideos = 0;
var rewarddado = 0;

var reshowx = 0;

googletag = window.googletag || {cmd: []};
               
function giveReward() {  
                        console.log("slotgranted giveReward"); 
			rewarddado = 1;
			myEnterXXX();
}
function slotclosed() {  
                        console.log("slotclosed"); 
			setTimeout(() => {
                                //reshowAd();
                        },
                        "300000");
			if ( reshowx == 0 )
			{
				myEnterXXX();
			}
}
function slotcanceled() {  
                        console.log("slotcanceled"); 
			setTimeout(() => {
				//reshowAd();
                        },
                        "300000");
			if ( reshowx == 0 )
                        {
                                myEnterXXX();
                        }
}



function reshowAd() {
			reshowx =  1;
		
			googletag.cmd.push( function() {
				var rewardedSlot = googletag
					.defineOutOfPageSlot('/147246189,22385467611/onworks.net_web_rewarded',googletag.enums.OutOfPageFormat.REWARDED)
					.addService(googletag.pubads());
				googletag.enableServices();
				googletag.pubads().addEventListener('rewardedSlotReady', function(evt) { evt.makeRewardedVisible(); });
				googletag.pubads().addEventListener('rewardedSlotGranted',giveReward);
				googletag.display(rewardedSlot);
			});
}



                
function showAd() {

                        document.getElementById('talpa-splash-button').innerHTML = 'Loading...';
                        setTimeout(() => { 
                            if ( viendolovideos == 0 )
                            {
                                console.log("too much time"); 
				//myEnterXXX();
                            }
                        }, 
                        "4000");  


			googletag.cmd.push( function() {
				var rewardedSlot = googletag
					.defineOutOfPageSlot('/147246189,22385467611/onworks.net_web_rewarded',googletag.enums.OutOfPageFormat.REWARDED)
					.addService(googletag.pubads());
				googletag.enableServices();
				googletag.pubads().addEventListener('rewardedSlotReady', function(evt) { evt.makeRewardedVisible(); });
				googletag.pubads().addEventListener('rewardedSlotGranted',giveReward);
                                googletag.pubads().addEventListener('rewardedSlotClosed',slotclosed);
                                googletag.pubads().addEventListener('rewardedSlotCanceled',slotcanceled);
				googletag.pubads().addEventListener('slotRenderEnded', function(event) {
          					console.log('Slot has been rendered:');
						if(event.isEmpty) {
						    if ( reshowx == 0 )
                        			    {
							myEnterXXX();
						    }
  						}
        			});
                                
                                googletag.display(rewardedSlot);
                        });
}





var rewarded = 0;
var urlredirect = "";


function fetchstatus() {


         setTimeout(() => {
                               document.getElementById("rewardedid").innerHTML = "Ready to enter";
                               document.getElementById("rewardedid").style.color = "green";
                 },
         "200");


}



function myEnter() {
	event.stopPropagation();
        document.getElementById("rewardedid").style.display = "block";
        document.getElementById("rewardedid").innerHTML = "Reward ok so now ready to enter";
        document.getElementById("rewardedid").style.color = "green";
        if ( rewarded == 1 ) {
                 rewarded = 0;
                 window.open(urlredirect, "_blank");
        }
        else {
		//showAd();
		rewarddado = 1;
		myEnterXXX();
        }
}


function myEnterXXX() {

 	try {
    		//document.getElementById('ad1').style.display = "none";
    	} catch (error) { }


	console.log("myenter");
   	if ( getWidthX()  > 0 )
   	{
	   document.getElementById('loginx').style.width = getWidthX();
   	}

	document.getElementById('x').style.display = "block";


	var mobile = "no";
	if ( getWidthX()  > 600 )
        {
                  mobile = "no";
        }
        else {
                  mobile = "yes";
        }


        document.getElementById('loginx00').style.display = "none";
	var iframe = document.createElement('iframe');
        //iframe.id = "login_banner";
	document.getElementById('loginx').innerHTML = "";
	iframe.classList.add("responsive-iframe");
	iframe.style.maxWidth = "1200px";

	console.log(getHeightX());
	var newh = getHeightX() - 110;
        console.log("222e newh " + newh );
        iframe.style.height = newh + "px";



   setTimeout(function() {

      if ( getWidthX()  > 0 )
      {
           iframe.width = getWidthX() + 'px';
           iframe.style.width = getWidthX() + 'px';
      }
   }, 1);


	iframe.src = "https://www.onworks.net/playonline/inprogress.php?mobile=" + mobile;;
	document.getElementById('loginx').appendChild(iframe);
	//document.getElementById('bargame').style.background = "#2b6599";


    	var username = "";
    	var username  = getCookie('username');
    	if ( username )
    	{
    	}
    	else {
       		username = "" + randomString(10) + "".toLowerCase();
       		setCookie('username',username,1);
    	}
	var extensionxxyy = "";

        if ( username ) { localStorage.setItem("namexxx", username); }; var username =  localStorage.getItem("namexxx");
        if ( username === null )
        {
                username = Math.floor(Date.now() / 1000);
                localStorage.setItem('namexxx', username);
        }

        localStorage.setItem('namexxx', username);

        var servicexxx = "";

        var xhr1 = new XMLHttpRequest();
        xhr1.open('GET', 'https://www.onworks.net/community/user.php?username=' + username, true);
        xhr1.onload = function (e) {
  		if (xhr1.readyState === 4) {
    			if (xhr1.status === 200) {

				//console.log("respuesta user");
      				//console.log(xhr1.responseText);
				var response1 = xhr1.responseText;
				servicexxx = response1;
				xhr2 = new XMLHttpRequest();
				if ( getWidthX()  > 600 )
				{
					mobile = "no";
				}
				else {
					mobile = "yes";
				}


				if ( getCookie("os") )
                                {
				  apkapk = getCookie("os");
                                  xhr2.open('GET', 'https://www.onworks.net/runos/create-os.php?v=1&service=' + response1 + '&username=' + username + '&app=' + $_GET("home") + '&os=' + getCookie("os"), true);
                                }
                                else {
                                  xhr2.open('GET', 'https://www.onworks.net/runos/create-os.php?v=1&service=' + response1 + '&username=' + username + '&app=' + $_GET("home"), true);
                                }
				xhr2.onload = function (e) {
                                        if (xhr2.status === 200) {

                                                var xhr3 = new XMLHttpRequest();
                                                xhr3.open('GET', 'https://www.onworks.net/community/user.php?username=' + username + '&service=' + response1, true);
                                                xhr3.send();

                                                console.log(xhr2.responseText);
                                                server = response1;
                                                numserver = server.replace("onworks", "");
                                                guest = xhr2.responseText;
                                                numguest = guest.replace("guest", "");

						var finalurl;
                                                if (window.location.protocol === 'http:') {
                                                        finalurl =  "https://www.onworks.net/osessionx" + numserver + "/#/?username=" + guest + "&password=server01" + numguest;
                                                }
                                                else {
                                                        finalurl =  "https://www.onworks.net/osessionx" + numserver + "/#/?username=" + guest + "&password=server01" + numguest;
                                                }
                                                if ( $_GET("facebook") )
                                                {
                                                        setCookie("facebook", "1", 365);
                                                }
                                                else {
                                                        if ( $_GET("htmlgame") )
                                                        {
                                                                setCookie("htmlgame", "1", 365);
                                                        }
                                                        else {
                                                                setCookie("facebook", "1", -1);
                                                                setCookie("htmlgame", "1", -1);

                                                        }
                                                }

						console.log("aaaaaaa");
						console.log(finalurl);

						timeouty = 10000;
                                                if ( getCookie("os") && (getCookie("os").indexOf("elementary") >= 0  ))
                                                        timeouty = 20000;
                                                if ( getCookie("os") && (getCookie("os").indexOf("debian-edu") >= 0  ))
                                                        timeouty = 20000;
                                                if ( getCookie("os") && (getCookie("os").indexOf("openSUSE-Edu") >= 0  ))
                                                        timeouty = 20000;
                                                if ( getCookie("os") && (getCookie("os").indexOf("uberstudent-4.3") >= 0  ))
                                                        timeouty = 20000;
                                                if ( getCookie("os") && (getCookie("os").indexOf("ubuntustudio") >= 0  ))
                                                        timeouty = 20000;
                                                if ( getCookie("os") && (getCookie("os").indexOf("Mageia") >= 0  ))
                                                        timeouty = 20000;
                                                if ( getCookie("os") && (getCookie("os").indexOf("kodiubuntu") >= 0  ))
                                                        timeouty = 20000;

                                                timeouty = 1000;
					
						var trtrertete = response1;	
						setTimeout(function() {
                                                       httpgetx(username, trtrertete);
                                                }, 5000);

                                                setTimeout(function() {
                                                        iframe.src = finalurl;
                                                }, 1);

						setTimeout(function() {
                                                        inactivityTime(iframe);
                                                }, 1);





                                                //setTimeout(
                                                //        function(){
                                                //                finalurlxx = btoa(finalurl);
                                                //                window.location = 'https://www.onworks.net/media/system/view/vncw.php?finalurl=' + finalurlxx;
                                                //        }
                                                //, $timeouty);
                                                // header('Location: ' . $finalurl, true, $permanent ? 301 : 302);
                                        }
                                        else {
                                                console.error(xhr2.statusText);
						runstartgame();
                                        }
                                };
                                xhr2.onerror = function (e) {
                                        console.error(xhr2.statusText);
					runstartgame();
                                };
                                xhr2.send();

    			} else {
      				console.error(xhr1.statusText);
				runstartgame();
    			}
 		 }
	};
	xhr1.onerror = function (e) {
  		console.error(xhr1.statusText);
		runstartgame();
	};
	xhr1.send();


        setTimeout(
            function(){
                var xhrxxx1 = new XMLHttpRequest();
                xhrxxx1.open('GET', 'https://www.onworks.net/community/user.php?username=' + username + "&service=" + servicexxx, true);
                xhrxxx1.send();
                iframe = document.getElementsByClassName('responsive-iframe')[0];
                inactivityTime(iframe);
            }
        , 8000);

	setTimeout(
            function(){
                var xhrxxx1 = new XMLHttpRequest();
                xhrxxx1.open('GET', 'https://www.onworks.net/community/user.php?username=' + username + "&service=" + servicexxx, true);
                xhrxxx1.send();
                iframe = document.getElementsByClassName('responsive-iframe')[0];
                inactivityTime(iframe);
            }
        , 18000);
    
    
}    







