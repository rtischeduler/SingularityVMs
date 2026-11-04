function messagexy() {

}

function executePostscribeLogic() {

        const script3 = document.createElement('script');
        script3.src = '//www.googletagmanager.com/gtag/js?id=UA-117545413-4';
        script3.async = true;
        script3.onload = function() {
                var i0 = '<script> ' +  "   window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-117545413-4'); " + '<\/script>';
                postscribe(document.head, i0);
        };
        document.head.appendChild(script3);

}



async function injectAdImage() {
  const adContainer = document.getElementById('sticky-ad');
  const adUrl = 'https://www.onworks.net/media/system/afi/getstck.php';

  try {
    const response = await fetch(adUrl);
    const data = await response.json();

    if (data.image && data.link) {
      //const anchor = document.createElement("a");
      //anchor.href = data.link;
      //anchor.target = "_blank";
      //anchor.rel = "noopener";
      //anchor.id = "ad-link";
      const anchor = document.getElementById('ad-link');
      anchor.href = data.link;

      //const img = document.createElement("img");
      const img = document.getElementById('ad-img');
      img.src = data.image;
      //img.alt = "Advertisement";
      //img.width = 720;
      //img.height = 90;
      //img.loading = "eager";
      //img.decoding = "async";
      //img.setAttribute('fetchpriority', 'high');

      //const disclaimer = document.createElement("div");
      //disclaimer.id = "ad-disclaimer";

      //const iconSpan = document.createElement("span");
      //iconSpan.className = "icon";
      //iconSpan.textContent = "❤️";

      //const textSpan = document.createElement("span");
      //textSpan.textContent = "Shop, book, or buy here — no cost, helps keep services free.";

      //disclaimer.appendChild(iconSpan);
      //disclaimer.appendChild(textSpan);

      //anchor.appendChild(img);
      //anchor.appendChild(disclaimer);

      //adContainer.appendChild(anchor);
      //adContainer.style.display = "block";
    }
  } catch (error) {
    console.error("Error loading ad:", error);
  }
}


const isMobile = window.matchMedia("(max-width: 768px)").matches;


if (isMobile) {
      setTimeout(function() {
    	const box2 = document.getElementById('boxindex2');
   	 if (box2) {
        box2.remove();
    	}
      }, 1);
      setTimeout(function() {
        const box3 = document.getElementById('boxindex3');
         if (box3) {
        box3.remove();
        }
      }, 1);
      setTimeout(function() {
        const bannerimage1 = document.getElementById('bannerimage1');
         if (bannerimage1) {
        bannerimage1.remove();
        }
      }, 1);
      setTimeout(function() {
        const picture1 = document.getElementById('picture1');
         if (picture1) {
        picture1.remove();
        }
      }, 1);
      
} 


// Wait for LCP before fetching ad
let lcpObserved = false;

const onLCPReady = () => {
    if (lcpObserved) return;
    lcpObserved = true;

    document.getElementById("ja-header").style.overflowY = "unset";

};


function handleFirstInteraction(event) {
    setTimeout(injectAdImage, 10);

    setTimeout(function() {
	const script = document.createElement('script');
        script.src = './postscribe.min.js';
    	script.async = true;
   	 script.onload = function() {
                console.log('post loade code...');
                executePostscribeLogic();
    	};
    	document.head.appendChild(script);
    }, 10);


    setTimeout(function() {
    }, 10);
    
}

function execFunction() {
  console.log("Running your one-time initialization logic...");
}

window.addEventListener("mousemove", handleFirstInteraction, { once: true });
window.addEventListener("touchstart", handleFirstInteraction, { once: true });

if ('PerformanceObserver' in window) {
    try {
      const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
	    console.log("onLCPReady ok");
            onLCPReady();
            po.disconnect();
            break;
          }
        }
      });
      po.observe({ type: 'largest-contentful-paint', buffered: true });

      // Fallback in case LCP doesn't fire in time
      setTimeout(onLCPReady, 5000);
    } catch (e) {
      // Older browser fallback
      console.log("Older browser");
      window.addEventListener('load', () => {
        setTimeout(onLCPReady, 1);
      });
    }
} else {
    // No PerformanceObserver support fallback
    console.log("No PerformanceObserver");
    window.addEventListener('load', () => {
      setTimeout(onLCPReady, 1);
    });
}


