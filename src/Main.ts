import { FavouriteList } from "./FavouriteList";
/*
let LastURL : string = "";
let LastName : string = "";

let observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		var new_url = document.location.toString();
		if(LastURL != new_url)
		{


		}
	});    
});

// Notify me of everything!
let observerConfig = {
	attributes: true, 
	childList: true, 
	characterData: true 
};
 
let targetNode = document.body;
observer.observe(targetNode, observerConfig);


// DataStore.LoadSettings();
// DataStore.SaveSettings();
// DataStore.LoadUserNote("User");
// DataStore.SaveUserNote("USer","note")


*/


//alert("hi");

let sidebar = document.querySelector('.side-bar-contents');


let newNote = new FavouriteList(null,null);

let insetInto = sidebar.childNodes[0];
insetInto.insertBefore(newNote.DomElement, insetInto.childNodes[0]);

console.log(newNote.DomElement);

//alert('ww');