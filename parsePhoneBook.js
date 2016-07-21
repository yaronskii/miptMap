function SendPost(dep, name, post, loc, loc_phone, phone) {
  	//отправляю POST запрос и получаю ответ
  	$$a({
  		type:'post',//тип запроса: get,post либо head
  		url:'ajax.php',//url адрес файла обработчика
  		data:{'department':dep, 'name': name, 'post':post, 'loc':loc, 'loc_phone':loc_phone, 'phone':phone},//параметры запроса
  		response:'text',//тип возвращаемого ответа text либо xml
  		success:function (data) {//возвращаемый результат от сервера
  			//$$('result',$$('result').innerHTML+'<br />'+data);
  		}
  	});
}

$(document).ready(function(){
	//document.getElementsByTagName('CAPTION')[1].innerHTML="Данное содержимое было изменено с помощью JavaScript.";
	//$("caption").append('<div class="row inner">firstSacses</div>');
	//alert( document.getElementsByTagName('CAPTION')[0] );
	/*
	var elems = document.getElementsByClassName('department');
	var children = elems[0].getElementsByTagName('*');
	//alert (children[0].innerHTML);
	for (var i = 0; i < children.length; i++) {
		var department = children[i];
		//if (department != "[object HTMLTableColElement]" && department != "[object HTMLTableCellElement]")
		//if (department == "[object HTMLTableRowElement]")
		//if (department == "[object HTMLTableElement]")
		if (department == "[object HTMLTableSectionElement]")
		{
			$('.result').append("<div>" + department.innerHTML+ "</div>"); 
		}
		 
	}

	*/
	
	dep = document.getElementsByClassName("department-wrapper")

	for(var i=0; i<dep.length; i++) {
		d = dep[i];
		caption = d.getElementsByTagName("CAPTION")[0].innerHTML
		SendPost(caption, name, post, loc, loc_phone, phone);
		//console.log(caption);
		tbody = d.getElementsByTagName("tbody")[0]
		trows = tbody.getElementsByTagName("tr")
		for(var j=0; j<trows.length; j++) {
			tr = trows[j];
			if(tr.id != "") {
				tdata = tr.getElementsByTagName("td");
				post = tdata[0].innerHTML;
				name = tdata[1].innerHTML;
				loc = tdata[2].innerHTML;
				loc_phone = tdata[3].innerHTML;
				phone = tdata[4].innerHTML;
				//SendPost(caption, name, post, loc, loc_phone, phone);
		//		console.log(name, post,loc, loc_phone, phone);
			}
		}
	}

	

	//alert (elems);
/*
	for (var i = 0; i < elems.length; i++) {
		var department = elems[i].innerHTML;
		SendPost(department);
	}
*/

	//var department = document.getElementsByTagName('CAPTION')[0].innerHTML;
	//SendPost(department);
	//alert( department );


	//$getElementsByTagName('caption')[1]


});

