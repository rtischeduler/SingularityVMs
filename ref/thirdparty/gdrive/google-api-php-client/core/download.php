<!DOCTYPE html>
<html>
<body onload="myFunction()" >

<script>
function myFunction() {
  var userxxx;
  if ( !localStorage.getItem("namexxx") )
  {
        userxxx = Math.floor(Math.random() * 2000000);
        localStorage.setItem("namexxx", userxxx);
        setCookie("username", userxxx, 365);
  }
  else {
        userxxx =  localStorage.getItem("namexxx");
        setCookie("username", userxxx, 365);
  }
  window.location.href="https://www.onworks.net/thirdparty/gdrive/google-api-php-client/core/download.php";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

</script>

<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js/vce701823e78c4301a35b7e07294d87301792088814092" integrity="sha512-UKNk8GbxkABxKcXYuLkO16EleLGUkcvJWtpSNmExE0Too3ZaFAxTscNWEc1OdAv5/BikHawapSCaiD2XCmp+Bw==" data-cf-beacon='{"version":"2024.11.0","token":"ba0dcedbb1df45deb53ac0015d68b90e","r":1,"spa":2}' crossorigin="anonymous"></script>
</body>
</html>