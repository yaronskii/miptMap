dep = document.getElementsByClassName("department-wrapper")

for(var i=0; i<dep.length; i++) {
	d = dep[i];
	caption = d.getElementsByTagName("caption")[0].innerHTML
	console.log(caption);
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
			console.log(name, post,loc, loc_phone, phone);
		}
	}
}

