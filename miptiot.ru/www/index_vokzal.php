 <HTML>
<HEAD>
<META HTTP-EQUIV="Content-Type"   target="_blank" CONTENT="text/html;charset=utf-8">
<TITLE>Схема</TITLE>
</HEAD>
<body>

<?
// По умолчанию выводим всю схему
     $var = 0; 
    $tip ='';	
 $kod = "";
 $par = 0; 
 
// Выбираем вариант ответа
if (isset($_POST['tip0']))
  {  
  // очищаем пробелы
   $tip = trim($_POST['tip0']);
     if ($tip =='vse');  
    // Вариант с выводом всей схемы
    $var = 0;   	
  }  
    Else
 {
  if (isset($_POST['tip1']))
   {  
    $tip1 = trim($_POST['tip1'.$i]);
    //echo  $tip, "<br>";
     if ($tip1 !='');
     {   
     If ($tip1 <> NULL)
     // Вариант с выводом статуса участка
     $var = 1;  
     }
   }  

}

// Чтение файла 
     $lines1 = file('vokzal/Organization.txt');
     $ii = 0;
     $kolstend = count($lines1);
	$nn =0;  // кол-во выбранных фирм
    for ($i = 0; $i < $kolstend; $i +=1)
	{
     // разбираем строку в массив
      $stroka1 = explode(';',$lines1[$i]); 
 //    echo   $stroka1[1], $stroka1[11], "<br>";
	   $ar1[$i] = $stroka1[0];  // Код места
       $ar2[$i] = $stroka1[1];  // Место
       $ar3[$i] = $stroka1[2];  // Площадь
       $ar4[$i] = $stroka1[3];  // Код состояния (продан или нет)
       $ar5[$i] = $stroka1[4];  // Состояние (продан или нет)
       $ar6[$i] = $stroka1[5];  // Код величины площади (в каком диапазоне)
	   $ar7[$i] = $stroka1[6];  // Диапазон площади
	   $ar8[$i] = $stroka1[7];  // Код типа дома
       $ar9[$i] = $stroka1[8];  // Тип дома
	   $ar10[$i] = $stroka1[9];  // Слева
	  
       $ar11[$i] =  trim($stroka1[10]);  // Слева
       $ar12[$i] = $stroka1[11];  // Сверху
	   $ar13[$i] = $stroka1[12];  // высота
	   $ar14[$i] = $stroka1[13];  // файл 		    
	   $ar15[$i] = 0;  // информационный массив о выбранных фирмах
	 
    }
	
		// Обработка POST
	If ($var ==0)
	{
	 // Вариант с выводом всей схемы
	 $nn =1;
	}

	If ($var ==1)
	{
	 // Вариант с выводом фирмы		    
	    for ($i = 0; $i < $kolstend; $i+=1)
	   {  
	 
       if ($ar7[$i] ==$tip1 ) 
	    {
		  $nn =1;
		  $ar15[$i] = 1; 		   
		 } 
		//  echo  $var, " ", $ar7[$i], " ", $tip1, " ", $ar15[$i],"<br>";
       }
	   
	  }


   
// Обработка POST

 if ($nn ==0)
  echo 'Организаций с заданными условиями поиска не найдено','<br/>';
 

	
// Чтение файла с типами1
$lines = file('vokzal/tip1.txt');
 for ($i = 0; $i < count($lines); $i +=1)
{
// разбираем строку в массив
 $stroka = explode(';',$lines[$i]); 
  $arr01[$i] =  trim($stroka[0]); 
  $arr1[$i] =  trim($stroka[1]); 
  
  //    echo $arr[$i], "<br>";  
}





// 
?>
<style>

.my_button1 {
  
margin-left:13px;
	
    width: 187px;
    height: 25px;
	background-color: #7DDEFF; 
	font-size: 12pt;
	
}

.text1 {	
   
	font-size: 16px;
	vertical-align: middle;
	
}
.blok0 {	
 
  margin-left:13px;
 
 }
.blok1 {	
 background-color: #C5EFF4; 
  margin-left:13px;

  width:187px;
border-top: 1px solid blue;
border-right: 3px solid blue;
border-bottom: 3px solid blue;
border-left: 1px solid blue;
 }
.blok2 {	
 background-color: #C5EFF4;
  margin-left:13px;

  width:187px;
border-top: 1px solid blue;
border-right: 3px solid blue;
border-bottom: 3px solid blue;
border-left: 1px solid blue;
 }
 .blok3 {	
 background-color: #C5EFF4; 
  margin-left:13px;
 
  width:187px;
border-top: 1px solid blue;
border-right: 3px solid blue;
border-bottom: 3px solid blue;
border-left: 1px solid blue;

 }
 
  .ris{	
  position:absolute;
 
  margin-left:210px;
  margin-top:0px; 	 

 }
</style>


<div class="ris">
<span style='position:absolute;margin-left:0px;margin-top:0px'> 
<img src="vokzal/vokzal.png">
</span>

 <span style='position:absolute;z-index:101;margin-left:607px;margin-top:168px'> 
<img  src="vokzal/vixod.png"  onmouseout="src='vokzal/vixod.png'" 
  onmouseover="src='vokzal/put_inf.png'" 
  alt="железнодорожные пути"></a></span>  
  
 <span style='position:absolute;z-index:101;margin-left:25px;margin-top:182px'>
<img  src="vokzal/park1.png"  onmouseout="src='vokzal/park1.png'" 
  onmouseover="src='vokzal/park_inf.png'" 
  alt="парковка"></a></span>  

<?php 
// Вывели подложку

for ($i = 0; $i < $kolstend; $i +=1) 
{ 
if ($ar15[$i] == 1)
 {
// встрелки
 ?>   
<span style='position:absolute;z-index:100000;margin-left:<?php  echo  $ar11[$i] - 2; ?>px;margin-top:<?php  echo  $ar12[$i] -30; ?>px'>
<img width=42 height=35
src="vokzal/STRELKA.png"></span>  
 <?php   
  }
}
 ?>
   
</div>  

<form action="index.php" method="post" >
<input type="submit" value="Главная" class="my_button1"/> 
 
</form>

<form action="" method="post" >

<br/>
<div class="blok1">
<a>Выберите объект:</a>

<?
echo '<br/>';
// выводим  список типов
$n = count($arr01);
for ($i = 0; $i <$n; $i +=1)
{  
 if ($arr01[$i] ==$tip1)
  {
   $color = 'style="color:red"';
  }
  else
   $color = '';
 
	echo '<input type="radio" name="tip1"  onchange="this.form.submit()" value='. $arr01[$i].'  ><span class="text1"  ' .$color.'>'.$arr1[$i]. '</span><br/>';
} 
?>
</div>
<br/>

</form>


			</body>
</html>

      
