<HTML>
<HEAD>
<META HTTP-EQUIV="Content-Type"   target="_blank" CONTENT="text/html;charset=utf-8">
<TITLE>Схема</TITLE>
</HEAD>
<body>
<H1 align=center  style="color:blue;" >Работа с координатами</H1>
<?

// Обрабатываем ответ от кнопки
if (isset($_POST['koord']))
  {  
// Определяем координаты (сначала определяем две функции, затем вызываем их)
 ?> 

<script>
 
//------------------------------------------------------------------
//---------- Часть кода, ответсвенная за поиск здания. -------------
//------------------------------------------------------------------

var marks = [ {latitude:55.929077, longitude:37.521426},
			  {latitude:55.928903, longitude:37.521490},
			  {latitude:55.928713, longitude:37.521592},
			  {latitude:55.929480, longitude:37.520463},
			  {latitude:55.929151, longitude:37.520731},
			  {latitude:55.928651, longitude:37.520817},
			  {latitude:55.929440, longitude:37.517680},
			  {latitude:55.929551, longitude:37.518131},
			  {latitude:55.929618, longitude:37.519053},
			  {latitude:55.929973, longitude:37.518253},
			  {latitude:55.930120, longitude:37.517920},
			  {latitude:55.930678, longitude:37.518043} ];

eps = 0.000001;

function getDistance(position_a, position_b)
{
//	console.log(position_a);
//	console.log(position_b);
	phi1 = position_a.latitude * Math.PI / 180.0;
//	console.log(phi1);
	phi2 = position_b.latitude * Math.PI / 180.0;
//	console.log(phi2);
	dphi = (position_b.latitude - position_a.latitude) * Math.PI / 180.0;
//	console.log(dphi);
	dalpha = (position_b.longitude - position_a.longitude) * Math.PI / 180.0;
//	console.log(dalpha);
	a = Math.sin(dphi / 2.0) * Math.sin(dphi / 2.0) + 
		Math.cos(phi1) * Math.cos(phi2) * Math.sin(dalpha / 2.0) * Math.sin(dalpha / 2.0);
//	console.log(a);
	c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
//	console.log(c);
	return c;
}		  
		  
function myCompare(a, b)
{
	if (a.distance + eps < b.distance)
	{ return -1; }
	if (b.distance + eps < a.distance)
	{ return 1; }
	return (a.building - b.building)
}		  
		  
function getBuilding(indoors_position)
{
	var measurements = [];
	for (i = 0; i < marks.length; i++)
	{
		measurements.push({distance:getDistance(marks[i], indoors_position.coords), 
						   building:Math.floor(i / 3)});
	}
	measurements.sort(myCompare);
//	console.log(measurements);
	var result = [0, 0, 0, 0], target = 0;
	for (i = 0; i < 3; i++)
	{
		result[measurements[i].building]++;
		if (result[target] < result[measurements[i].building])
		{ target = measurements[i].building; }
	}
	return target + 1;
}

//------------------------------------------------------------------

loc_codes = {
	OUTDOORS : 0,
	INDOORS : 1,
	NOWIFI : 2,
	BADACC : 3
};

function checkOutdoors(position)
{
	if (position.accuracy > outdoors_threshold)
	{
		if (position.accuracy > wifi_threshold)
		{ return loc_codes.NOWIFI; }
		if (position.accuracy > enough_threshold)
		{ return loc_codes.BADACC; }
		return loc_codes.INDOORS;
	}
	return loc_codes.OUTDOORS;
}

//------------------------------------------------------------------

outdoors_threshold = 20;
wifi_threshold = 480;
enough_threshold = 180;
decision_point = 3;

buildings = {
	OUTDOORS : 0,
	APB : 1,
	NB : 2,
	MB : 3,
	LB : 4,
	ERROR : 5
};

var place = buildings.OUTDOORS, ready = false, in_use = false,
	id, desired_accuracy = 7, counter = 0, max_counter = 9, best;

function getCoordinates()
{
	if (navigator.geolocation)
	{
		id = navigator.geolocation.watchPosition(processCoordinates,
							 showError,
							 {enableHighAccuracy:true,
							 timeout:5000,
							 maximumAge:0});   
	}
	else
	{
		alert("Геолокация не поддерживается текущим браузером.");
	}
}

function showError(error)
{
	navigator.geolocation.clearWatch(id);
	counter = max_counter + 1;
	switch(error.code)
	{
		case error.PERMISSION_DENIED:
			alert('Запрос блокирован пользователем.')
			break;
		case error.POSITION_UNAVAILABLE:
			alert('Информация о местоположении недоступна.')
			break;
		case error.TIMEOUT:
			alert('Превышено время обработки запроса.')
			break;
		default:
			alert('Произошла неизвестная ошибка.')
			break;
	}
}

function processCoordinates(position)
{
	if (in_use) return 0;
	in_use = true;
	counter++;
	if (counter == 1)
	{ best = position; }
	if (best.accuracy > position.accuracy)
	{ best = position; }
	if (counter == decision_point)
	{
		result = checkOutdoors(best);
		switch(result)
		{
			case loc_codes.OUTDOORS:
				break;
			case loc_codes.INDOORS:
				navigator.geolocation.clearWatch(id)
				place = getBuilding(best)
				finalizePosition(best, place)
				break;
			case loc_codes.NOWIFI:
				navigator.geolocation.clearWatch(id)
				alert('Пожалуйста, используйте подключение к сети Wi-Fi для навигации, находясь внутри зданий.')
				finalizePosition(best, buildings.ERROR)
				break;
			case loc_codes.BADACC:
				max_counter = 6
				desired_accuracy = enough_threshold
				alert('Пожалуйста, подождите немного.')
				break;
		}
	}
	if (best.accuracy < desired_accuracy || counter >= max_counter)
		{
			navigator.geolocation.clearWatch(id);
			place = getBuilding(best);
			finalizePosition(best, place);
		}
	in_use = false;
}

function finalizePosition(position, place)
{
	in_use = false;
	if (position.accuracy < 12)
	{
		place = buildings.OUTDOORS;
	}
	text = 'Широта: ' + position.coords.latitude + 
			' Долгота: ' + position.coords.longitude + 
			' Ошибка: ' + parseInt(position.coords.accuracy, 10);
	if (place == buildings.OUTDOORS)
	{
		alert(text);
	}
	if (place == buildings.ERROR)
	{
		alert('Не удалось провести геолокацию.');
	}
	
// <--- Здесь и только здесь можно делать всё что угодно с координатами и полученным зданием.	
// Пока будет по-простому.	
	switch(place)
	{
		case buildings.APB:
			alert(text + ' Вы находитесь в корпусе прикладной матетматики.')
			break;
		case buildings.MB:
			alert(text + ' Вы находитесь в главном корпусе.')
			break;
		case buildings.NB:
			alert(text + ' Вы находитесь в новом корпусе.')
			break;
		case buildings.LB:
			alert(text + ' Вы находитесь в лабораторном корпусе.')
			break;
	}
}

getCoordinates();

//------------------------------------------------------------------
//---------- Конец-части кода, ответсвенной за поиск здания. -------
//------------------------------------------------------------------
</script>	
<?


 }

?>



<form action="" method="post" >

<?
// Выводим кнопку на экран в форме

 echo '<BUTTON  type="submit" style=" height:38px;  color:red; width:186px; margin-left:5px; vertical-align: left; font-size: 12px" name="koord" ><strong>координаты</strong></BUTTON><br/>';

?>

    </form> 
			</body>
</html>
