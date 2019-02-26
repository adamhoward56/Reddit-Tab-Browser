var totalPosts = 0;
var canNav = false;
var currentPost = 0;
var posts = [];
var comments = [];
var temp;
var urlParams;
var isComments = false;
var autoScroll = false;
var canScroll = false;

function init( data ) {
	if (isComments) {
		commentPage(data);
		update(0);
		console.log(data);
	} else {
		homePage( data );
		update(0);
	}
	canScroll = true;
}

function homePage ( data ) {
	posts = data.data.children;
	totalPosts = posts.length;
	canNav = true;
}

function commentPage ( data ) {
	comments = data[1].data.children;
	totalPosts = comments.length;
	console.log(data[1].data.children[0].data.body);
	canNav = true;
}

function update(i) {
	if (i >= 0 && i < totalPosts) {
		currentPost = i;
		// Handle the front page
		if (!isComments) {
			if (posts[i].data.thumbnail == "self" || posts[i].data.thumbnail == "default") {
				$("#favicon").attr("href", "https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png");
			} else {
				$("#favicon").attr("href", posts[i].data.thumbnail);
			}

			document.title = posts[i].data.title + " - r/" + posts[i].data.subreddit + " - " + posts[i].data.score;

			if (posts[0].data.score < 0) {
				document.title += " Downvotes";
			} else {
				document.title += " Upvotes";
			}

			temp = document.title + " - ";

		// Handle the comments section
		} else {
			temp = comments[i].data.body + " - u/" + comments[i].data.author + " - ";
			var score = comments[i].data.score;
			if (score >= 0) {
				temp += score + " Upvotes - ";
			} else {
				temp += score + " Downvotes - ";
			}
			document.title = temp;
		}
	}
}

$(document).keydown(function(e) {
	if (canNav) {
	    switch(e.which) {
	    	
	        case 37: // left
	        	var width = temp.length;
        		temp = temp.slice(width-5,width) + temp.slice(0,width-5); // Read back
        		document.title = temp;

	        	e.preventDefault();
	        break;

	        case 38: // up
	        	update(currentPost - 1);
	        	e.preventDefault(); // prevent the default action (scroll / move caret)
	        break;

	        case 39: // right
	        	var width = temp.length;
        		temp = temp.slice(5) + temp.slice(0,5); // Read back
        		document.title = temp; // Move forward
	        break;

	        case 40: // down
        		update(currentPost + 1);
	        	e.preventDefault();
	        break;

	        case 13:
	        	if (!isComments) {
	        		window.open(posts[currentPost].data.url, "_blank");
	        	} else {
	        		window.open("https://reddit.com" + urlParams.comments, "_blank");
	        	}
	        	e.preventDefault();
	        break;

	        case 8:
	        	e.preventDefault();
    			if (isComments) {
    		    	window.location = window.location.href.split("?")[0];
				}
        	break;

        	case 67:
        		if (!isComments) {
        			var url = window.location.href;
        			url += "?comments=" + posts[currentPost].data.permalink;
        			window.location.href = url;
        		}
    		break;

    		case 65:
    			autoScroll = !autoScroll;
    		break;

	        default: break; // exit this handler for other keys
	    }
	}
});

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var x = 0; x < hashes.length; x++)
    {
        hash = hashes[x].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$(document).ready(function() {
	urlParams = getUrlVars();
	if ("comments" in urlParams) {
		//console.log("This is a comments page.");
		var url = "http://www.reddit.com" + urlParams.comments + ".json?jsonp=init";
		//console.log(url);
		$.getScript(url, function(){
		    //console.log("Loading comments page: " + urlParams.comments);
		});
		isComments = true;


	} else {
		$.getScript("http://www.reddit.com/.json?jsonp=init", function(){
		    //console.log("Loading reddit homepage.");
		});
	
	}
});

setInterval(function(){
	if (autoScroll && canScroll) {
		var width = temp.length;
		temp = temp.slice(1) + temp.slice(0,1); // Read back
		if (temp.charAt(0) == ' ') {
			document.title = "_" + temp.substr(1);
		} else {
			document.title = temp;
		}
	}
}, 100);