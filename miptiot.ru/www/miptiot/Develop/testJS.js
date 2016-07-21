$(document).ready(function(){

	

	for (var i = 0; i < 24; i++) {
		$(".mapInner").append('<div class="row inner'+i+'"></div>');
			
		  
	}
	var number = 0;
	for (var i = 0; i < 24; i++) {
			for (var j = 0; j < 24; j++) {
				
				$(".row.inner" +i).append('<div class="col-xs-1 "> \
		         <div class="image'+number+'" > \
		         <div class="test">\
		         <div class="test">\
		           <img src="smalImagesPng/image_' + number +'.png" class="img-responsive" alt="Responsive image"> \
		         </div>\
		         </div>\
		         </div> \
		       </div>');
				number++;
			}
	}

	function sayThanks() {
	  alert( 'Спасибо!' );
	};

	var images = [];
	var strClass, strNum;

	for (var i = 0; i < 576; i++) {
		$(".image" +i).click(function(){
			strClass = $(this).attr("class");
			strNum = strClass.charAt(5);
			for (var i = 6; i < strClass.length; i++) {
				strNum = strNum + strClass.charAt(i); 
			}
			images.push(strNum);
			$(this).children().addClass("light");
		    $(this).children().children().addClass("yellow");

		});
	}

	var PointB = {
	  coordX: 0,
	  coordY: 0,
	  tablNum: 24,
	  init: function (a) {
	    this.coordX = Math.floor(a%this.tablNum) ;
	    this.coordY = Math.floor(a/this.tablNum) ;
	  }
	};
	var PointA = {
	  coordX: 0,
	  coordY: 0,
	  tablNum: 24,
	  init: function (a) {
	    this.coordX = Math.floor(a%this.tablNum) ;
	    this.coordY = Math.floor(a/this.tablNum) ;
	    
	  }
	};

	var a, b, addingItems = [], addingInside = [];


	function continueAddForPoints(){
		var firstImage = images[0];
		for (var i = 0; i < images.length-1; i++) {
			continueAdd();
		}
		images.push(firstImage);
		continueAdd();
	}
	function continueAdd(){
		var a, b, coef, swapA, swapB;
		a = images[0];
		b = images[1];
		PointB.init(b);
		PointA.init(a);
		if (PointB.coordX - PointA.coordX != 0) {
			if (PointB.coordX - PointA.coordX < 0) {
				swapA = PointB.coordX;
				swapB = PointB.coordY;
				PointB.coordX = PointA.coordX;
				PointB.coordY = PointA.coordY;
				PointA.coordX = swapA;
				PointA.coordY = swapB;
			}
			coef = (PointB.coordY - PointA.coordY)/(PointB.coordX - PointA.coordX);
			for (var i = 0; i <= PointB.coordX - PointA.coordX  ; i++) {
				a = PointA.coordX + i;
				b = Math.floor(PointA.coordY + coef*i);
				addingItems.push(24*b + a);
			}
			images.shift();
		}
		if (PointB.coordX - PointA.coordX == 0) {
			a = PointA.coordX;
			if (PointB.coordY - PointA.coordY < 0) {
				swapA = PointB.coordX;
				swapB = PointB.coordY;
				PointB.coordX = PointA.coordX;
				PointB.coordY = PointA.coordY;
				PointA.coordX = swapA;
				PointA.coordY = swapB;
			}
			for (var i = 0; i <= PointB.coordY - PointA.coordY ; i++) {
				b = PointA.coordY + i;
				addingItems.push(24*b + a);
			}
			images.shift();
		}
		
	}

	

	function sortQuick(int){
		for (var j = 0, len = int.length - 1; j < len; j++) {
	    var swapped = false;
	    var i = 0;
	    while (i < len) {
	        if (int[i]%24 > int[i + 1]%24) {
	            var c = int[i];
	            int[i] = int[i + 1];
	            int[i + 1] = c;
	            swapped = true;
	        }
	        i++;
	    }
	    
	    if(!swapped)
	        break;
	}
	}
	
	function addInside(){
			
			var Left, Right;
			addingItems.sort(function(a,b){return a-b;});
			for (var i = 0; i < addingItems.length - 1; i++) {
				Left = addingItems[i];
				Right = addingItems[i+1];
				if (Left == Right) {
					addingItems[i] = -1;
				}
			}

			addingItems.sort(function(a,b){return a-b;});
			
			while (addingItems[0] == -1){
				addingItems.shift();
			}

			//addingItems.sort(function(a,b){return a%24-b%24;});
			sortQuick(addingItems);

		/* // для прохода по строчкам
			for (var i = 0; i < addingItems.length; i++) {
				Left = addingItems[i];
				
				Right = addingItems[i+1];

				$(".debag").append('<p>' + Left + ',' + Right + '</p>');
				
				if (Math.floor(Left/24) != Math.floor(Right/24) ) {
					continue;
				}
				else {
					i++;
				}
				for (var j = Left+1; j < Right; j++) {
					addingInside.push(j);
				}
				
			}
		*/
			for (var i = 0; i < addingItems.length; i++) {
				Top = addingItems[i];
				
				Battom = addingItems[i+1];

				//$(".debag").append('<p>' + Top + ',' + Battom + '</p>');
				
				if (Math.floor(Top%24) != Math.floor(Battom%24) ) {
					continue;
				}
				else {
					/* Эвристика для не выпуклых фигур
					var countBefore=0, countAfter=0;
					for (var j = 0; j < i; j++) {
						if (addingItems[j]%24 == Top%24){
							countBefore++;
						}
					}
					for (var j = i; j < addingItems.length; j++) {
						if (addingItems[j]%24 == Top%24){
							countAfter++;
						}
					}
					if ((countAfter+countBefore)%2 == 1) {
						i++;
					}*/
					i++
					
				}
				for (var j = Top+24; j < Battom; j+=24) {
					addingInside.push(j);
				}
				
			}

			for (var i = 0; i < addingInside.length; i++) {
			    $(".image" + addingInside[i] ).children().addClass("light");
			    $(".image" + addingInside[i] ).children().children().addClass("yellow");
			}
	}

	$(".continueAdding").click(continueAddForPoints);

	$(".yellow").hover(function(){
	    $(".yellow").css({"opacity":"0.5", "background-color":"white"});
	    }, function(){
	    $(".yellow").css({"opacity":"0.7", "background-color": "white"});
	});
	
	$(".showNumbers").click(function(){
		for (var i = 0; i < addingItems.length; i++) {
		    $(".image" + addingItems[i] ).children().addClass("light");
		    $(".image" + addingItems[i] ).children().children().addClass("yellow");
		}
	});

	$(".addInsidePoints").click(addInside);

});

