<?
include_once('muzej/shema_zal.php');
 ?>
 <HTML>
<HEAD>
<META HTTP-EQUIV="Content-Type"   target="_blank" CONTENT="text/html;charset=utf-8">
<TITLE>Схема</TITLE>
</HEAD>
<body>
<?
  
// Чтение файла с типами1
$lines = file('muzej/tip1.txt');
$lin1 = count($lines);
 for ($i = 0; $i < $lin1; $i +=1)
{
// разбираем строку в массив
 $stroka = explode(';',$lines[$i]); 
  $arr01[$i] =  trim($stroka[0]); 
  $arr1[$i] =  trim($stroka[1]); 
  
  //    echo $arr[$i], "<br>";  
}

// Чтение файла с типами2
$lines = file('muzej/tip2.txt');
$lin2 = count($lines);
 for ($i = 0; $i < $lin2; $i +=1)
{
// разбираем строку в массив
 $stroka = explode(';',$lines[$i]); 
  $arr02[$i] =  trim($stroka[0]); 
  $arr2[$i] =  trim($stroka[1]); 
  
  //    echo $arr[$i], "<br>";  
}
$podr =0;
 // обрпаботка ПОДРОБНЕЕ - витрины
  for ($i = 0; $i < $lin1; $i +=1)
  {
   $r  ='r'.$arr01[$i]; 
 //  echo $r[0], "<br>"; 
   if (isset($_POST[$r]))
   { 
   $tt = trim($_POST[$r]);   //очистка от пробелов
   $tttt = trim(substr($tt,-2));    // возвращает 2  символа справа
// echo $tt,$tttt, "<br>"; 
	$podr = 1; 
 $xx = vvod($arr01[$i],$arr1[$i],$r,$tt,$tttt);
 
   }  
  }
  for ($i = 0; $i < $lin2; $i +=1)
  {
   $w  ='w'.$arr02[$i];   
   if (isset($_POST[$w]))
   { 
   $tt = trim($_POST[$w]);   //очистка от пробелов
   $tttt = trim(substr($tt,-2));    // возвращает 2  символа справа
     $tip1 =$arr02[$i] + 21;	  	
	$podr = 1; 
 $xx = vvod($tip1,$arr2[$i],$w,$tt,$tttt);
   }  
  }
  

 If ($podr ==0)
{

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
 // Вариант с выводом статуса участка
   for ($i = 0; $i < $lin1; $i +=1)
  {
   $t  ='p'.$arr01[$i];   
   if (isset($_POST[$t]))
   { 
    $t1 = trim($_POST[$t]);
     $tip1 =$arr01[$i];	
     $var = 1;
	//  echo  $tip1,' ', $var, "<br>"; 
   }  
  }
  // Вариант с выводом второго
   for ($i = 0; $i < $lin2; $i +=1)
  {
   $t  ='t'.$arr02[$i];   
   if (isset($_POST[$t]))
   { 
    $t1 = trim($_POST[$t]);
     $tip2 =$arr02[$i];	
     $var = 2;
	//  echo  $tip2,' ', $var, "<br>"; 
   }  
  }
}
// Чтение файла 
     $lines1 = file('muzej/Organization.txt');
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
	  
       $ar11[$i] =  trim($stroka1[10]);  // Сверху
       $ar12[$i] = $stroka1[11];  // ширина
	   $ar13[$i] = $stroka1[12];  // высота
	   $ar14[$i] = $stroka1[13];  // файл 		    
	   $ar15[$i] = 0;  // информационный массив о выбранных фирмах
	// echo  $ar1[$i], $ar10[$i], $ar11[$i],"<br>";
    }
	// Чтение файла второго этажа
     $lines1 = file('muzej/Organization2.txt');
     $ii = 0;
     $kolstend2 = count($lines1);
	$nn =0;  // кол-во выбранных фирм
    for ($i = 0; $i < $kolstend2; $i +=1)
	{
     // разбираем строку в массив
      $stroka1 = explode(';',$lines1[$i]); 
 //    echo   $stroka1[1], $stroka1[11], "<br>";
	   $at1[$i] = $stroka1[0];  // Код места
       $at2[$i] = $stroka1[1];  // Место
       $at3[$i] = $stroka1[2];  // Площадь
       $at4[$i] = $stroka1[3];  // Код состояния (продан или нет)
       $at5[$i] = $stroka1[4];  // Состояние (продан или нет)
       $at6[$i] = $stroka1[5];  // Код величины площади (в каком диапазоне)
	   $at7[$i] = $stroka1[6];  // Диапазон площади
	   $at8[$i] = $stroka1[7];  // Код типа дома
       $at9[$i] = $stroka1[8];  // Тип дома
	   $at10[$i] = $stroka1[9];  // Слева
	  
       $at11[$i] =  trim($stroka1[10]);  // Сверху
       $at12[$i] = $stroka1[11];  // ширина
	   $at3[$i] = $stroka1[12];  // высота
	   $at14[$i] = $stroka1[13];  // файл 		    
	   $at15[$i] = 0;  // информационный массив о выбранных фирмах
	// echo  $at1[$i], $at10[$i], $at11[$i],"<br>";
    }
	
		// Обработка POST
	If ($var ==0)
	{
	 // Вариант с выводом всей схемы
	 $nn =1;
	}
	
	If ($var ==1)
	{
	
	 // Вариант выбранный	    
	    for ($i = 0; $i < $kolstend; $i+=1)
	   {  
   //    echo   $ar4[$i],' ', $tip1,"<br>";	   
   
       if ($ar4[$i] === $tip1) 
	    {	
		  $nn =1;
		  $ar15[$i] = 1; 
		//    echo  $ar15[$i],"<br>";	
		 } 
      }
	}
If ($var ==2)
	{
	
	 // Вариант выбранный	    
	    for ($i = 0; $i < $kolstend2; $i+=1)
	   {  
    //   echo   $at4[$i],' ', $tip2,"<br>";	   
   
       if ($at4[$i] === $tip2) 
	    {	
		  $nn =1;
		  $at15[$i] = 1; 
		//    echo  $ar15[$i],"<br>";	
		 } 
      }
	}


// Обработка POST

 
  ?>
 <span style='position:absolute;margin-left:270px;'> 
  <?php
  if ($nn ==0) 
echo 'Информации с заданными условиями поиска не найдено','<br/>';
  ?>
</span>
  <?php 

 for ($i = 0; $i < $kolstend; $i+=1)
	   { 
         $ar16[$i] = 'muzej/Docvse/f'.$ar1[$i].'.png';		   
		
		 
             $ar17[$i] = 'muzej/Risunok/s'.$ar1[$i].'.png';	   
		// echo  $ar17[$i],"<br>";
       }
	   // 2 этаж
  for ($i = 0; $i < $kolstend2; $i+=1)
	   { 
         $at16[$i] = 'muzej/Docvse/f'.$at1[$i].'.png';		   
		
		 
             $at17[$i] = 'muzej/Risunok/s22.png';		   
		// echo  $ar17[$i],"<br>";
     }
}
?>
<style>

.my_button1 {
position:absolute; 
  margin-left:5px;
  margin-top:-3px; 
    width: 186px;
    height: 30px;
	background-color: #7DDEFF; 
	font-size: 12pt;
}
.my_button21 {
position:absolute; 
  margin-top:45px; 
}

.blok0 {	 
  margin-left:13px
 }
 
  .ris{	
  position:absolute; 
  margin-left:191px;
  margin-top:20px;  
 }
  .ris2{	
  position:absolute; 
  margin-left:848px;
  margin-top:30px;  
 }
  .my_button2{	
  position:absolute; 
  margin-left:655px;
  margin-top:36px; 
 }
 .my_button3{	
  position:absolute; 
  margin-left:660px;
  margin-top:0px; 
   width: 186px;
    height: 30px;
	background-color: #7DDEFF; 
	font-size: 12pt;
   }
     .my_button30{	
  position:absolute; 
  margin-left:205px;
  margin-top:-3px; 
   width: 186px;
    height: 30px;
	background-color: #7DDEFF; 
	font-size: 12pt;
   }
     .my_button31{	
  position:absolute; 
  margin-left:860px;
  margin-top:0px; 
   width: 186px;
    height: 30px;
	background-color: #FBB896; 
	font-size: 12pt;
   }
 .my_kart{	
  position:absolute; 
  margin-left:700px;
  margin-top:50px; 
width:400px;
height:480px;
border:4px solid blue;
padding: 5px;
background-color: #FFFFF1;
 }
  .my_kart1{	
  position:absolute; 
  margin-left:30px;
  margin-top:50px; 
width:400px;
height:480px;
border:4px solid blue;
padding: 5px;
background-color: #FFFFF1;
 }
 </style>
 <?
If ($podr ==0)
{
  If ($var == 1)
  {
  for ($i = 0; $i < $kolstend; $i +=1) 
{ 
if ($ar15[$i] === 1)
 { 
  ?>
 
 <div class="my_kart">
<!-- первый пример с отступами и выравниванием по левому краю-->
<FONT SIZE="+2" COLOR="blue"><?php  echo  $ar5[$i]; ?><br>   образец информации</FONT><br>

<p align="justify" style="text-indent: 25px;"> <img src="muzej/Risunok/z6.JPG" width="150" height="113" hspace="15" vspace="15" align="left" >
     Архитектура зала воспроизводит ступенчатый свод склепа из царского кургана Куль-Оба, раскопанного в Крыму в XIX в.
     Над входом	- прорисовка рельефного фриза с вазы из другого кургана - Чертомлык; хорошо видны одежда, головные
уборы и прическа скифских воинов. Изображения конных воинов и юрт на стенах зала скопированы из керченских склепов первых веков н.э., в 
которых была погребена сарматская знать. </p>
<p align="justify" style="text-indent: 25px;">В III в. до н.э. в степях Северного Причерноморья на историческую арену Выступает мощный союз кочевых племен - сарматы, 
предметы из захоронений которых представлены в витринах 1 - 3 зала. </p>

</div>
<?
  }
 }
}
  If ($var == 2)
  {
   for ($i = 0; $i < $kolstend2; $i +=1) 
{ 
if ($at15[$i] === 1)
 { 
  ?>

 <div class="my_kart1">
<!-- первый пример с отступами и выравниванием по левому краю-->
<FONT SIZE="+2" COLOR="blue"><?php  echo  $at5[$i]; ?><br>   образец информации</FONT><br>

<p align="justify" style="text-indent: 25px;"> <img src="muzej/Risunok/z6.JPG" width="150" height="113" hspace="15" vspace="15" align="left" >
     Архитектура зала воспроизводит ступенчатый свод склепа из царского кургана Куль-Оба, раскопанного в Крыму в XIX в.
     Над входом	- прорисовка рельефного фриза с вазы из другого кургана - Чертомлык; хорошо видны одежда, головные
уборы и прическа скифских воинов. Изображения конных воинов и юрт на стенах зала скопированы из керченских склепов первых веков н.э., в 
которых была погребена сарматская знать. </p>
<p align="justify" style="text-indent: 25px;">В III в. до н.э. в степях Северного Причерноморья на историческую арену Выступает мощный союз кочевых племен - сарматы, 
предметы из захоронений которых представлены в витринах 1 - 3 зала. </p>

</div>
<?
  }
 }
}
?> 
 
<form action="index.php" method="post" >
<input type="submit" value="Главная" class="my_button1"/> 
</form>
<?
 If ($var == 1 Or $var == 2)
 {
  If ($var == 1)
 $r = "r".$tip1;

 else
 $r = "w".$tip2;
?> 
  <form action="index_muzej.php" method="post" >
<input type="submit" value="Сброс выбора" class="my_button3"/> 
</form>
<form action="" method="post" >
<input type="submit" value="Подробнее"  name="<?php  echo  $r; ?>" class="my_button31"/> 
</form>
<?
}
 If ($var != 1)
 {
?> 
<div class="my_button2">
<form action="" method="post" >
<?
// выводим  кнопки для 2 этажа
$n = count($arr02);
for ($i = 0; $i <$n; $i +=1)
{   
 if ($arr02[$i] === $tip2) 
  {  
    $color = 'color:red;';	
  }
  else
   $color = '';	 
    $t  ='t'.$arr02[$i];
  echo '<BUTTON  type="submit" style=" height:37px; width:186px; margin-left:5px; margin-bottom:7px; vertical-align: left;'.$color.' font-size: 12px" name="'.$t.'"><strong>'.$arr2[$i]. '</strong></BUTTON><br/>';
  } 
?>
    </form> 
</div>   
 <div class="ris2">
 <span style='position:absolute'>
<img src="muzej/image202.png"></span>
 <?php 
for ($i = 0; $i < $kolstend2; $i+=1)
{ 
 
// вводим теги координат имен файлов с кубиками и гиперссылки
 ?>   

<span style='position:absolute;z-index:<?php  echo 100000 - $at11[$i] - $at10[$i]; ?>;margin-left:<?php  echo  $at10[$i]; ?>px;margin-top:<?php  echo  $at11[$i]; ?>px'>
<img 

 src="<?php   echo  $at16[$i];    ?>" onmouseout="src='<?php   echo  $at16[$i];    ?>'" 

  onmouseover="src='<?php   echo  $at17[$i];    ?>'"
  
 
  alt="<?php  echo  $at2[$i]; ?>"></span>  

 <?php   
}
for ($i = 0; $i < $kolstend2; $i +=1) 
{ 
if ($at15[$i] === 1)
 { 
// встрелки
 ?>   
<span style='position:absolute;z-index:100000;margin-left:<?php  echo  $at10[$i] - 3; ?>px;margin-top:<?php  echo  $at11[$i] -30; ?>px'>
<img width=52 height=43
src="muzej/STRELKA.png"></span>  
 <?php   
  }
}
 ?>
</div> 

 <?php
}

If ($var != 2)
 {
 ?>
<div class="ris">
<span style='position:absolute;margin-left:0px;'> 
<img src="muzej/image200.png">
</span>

<?php 
// Вывели подложку

for ($i = 0; $i < $kolstend; $i+=1)
{ 
 
// вводим теги координат имен файлов с кубиками и гиперссылки
 ?>   

<span style='position:absolute;z-index:<?php  echo 100000 - $ar11[$i] - $ar10[$i]; ?>;margin-left:<?php  echo  $ar10[$i]; ?>px;margin-top:<?php  echo  $ar11[$i]; ?>px'>
<img 
 src="<?php   echo  $ar16[$i];    ?>" onmouseout="src='<?php   echo  $ar16[$i];    ?>'" 
  onmouseover="src='<?php   echo  $ar17[$i];    ?>'"
  alt="<?php  echo  $ar2[$i]; ?>"></span>  
 <?php   
}

   

for ($i = 0; $i < $kolstend; $i +=1) 
{ 
if ($ar15[$i] === 1)
 { 
// встрелки
 ?>   
<span style='position:absolute;z-index:100000;margin-left:<?php  echo  $ar10[$i] - 3; ?>px;margin-top:<?php  echo  $ar11[$i] -30; ?>px'>
<img width=52 height=43
src="muzej/STRELKA.png"></span>  
 <?php   
  }
}

 ?>  
</div>  




<form action="" method="post" >
<span style='position:absolute;margin-left:20px;margin-top:27px;> '> 
<strong>   <FONT  COLOR="#3300DD"> Выберите экспозицию:</FONT> </strong></span>

<div class="my_button21">
<?
// выводим  кнопки для 1 этажа
$n = count($arr01);
for ($i = 0; $i <$n; $i +=1)
{   
 if ($arr01[$i] === $tip1) 
  {  
    $color = 'color:red;';	
  }
  else
   $color = '';	 
    $t  ='p'.$arr01[$i];
  echo '<BUTTON  type="submit" style=" height:37px; width:186px; margin-left:5px; vertical-align: left;'.$color.' font-size: 12px" name="'.$t.'"><strong>'.$arr1[$i]. '</strong></BUTTON><br/>';
  } 
?>
</div> 
    </form> 
	 <?php 
}
}
?>
 
			</body>
</html>

      
