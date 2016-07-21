<?
include_once('fakult.php');
?>
 <HTML>
<HEAD>
<META HTTP-EQUIV="Content-Type"   target="_blank" CONTENT="text/html;charset=utf-8">
<TITLE>Схема</TITLE>
</HEAD>
<body>
 
<style>

.my_button1 {
position:absolute; 
  margin-left:-2px;
  margin-top:-2px; 
    width: 170px;
    height: 32px;
	font-size: 12pt;
	background-color: #F9F9F9; 
	border:none;
	}
	.my_button1:hover {
background-color: #2168CC; 
color: #FFFFFF;	
	}
.my_button11 {
position:absolute; 
  margin-left:-2px;
  margin-top:-2px; 
    width: 166px;
    height: 32px;
	font-size: 12pt;
	color: #FFFFFF;
	background-color: #2168CC; 
	border:none;
	}
	.my_button11:hover {
background-color: #F9F9F9; 
color: #000000;	
	}
.my_button21 {
position:absolute; 
  margin-top:35px; 
 }
 .my_button212 {
 height:35px;
 width:156px;
 margin-left:-2px; 
 vertical-align: left;
 border:none;
	}
	.my_button212:hover {
background-color: #2168CC; 
color: #FFFFFF;	
	}
.my_button3{	
  position:absolute; 
  margin-left:180px;
  margin-top:-2px; 
   width: 186px;
    height: 32px;
	color: #FFFFFF;
	font-size: 12pt;
  	background-color: #2168CC; 
	border:none;
	}
	.my_button3:hover {
background-color: #F9F9F9; 
color: #000000;	
	}
   .my_button31{	
  position:absolute; 
  margin-left:380px;
  margin-top:-2px; 
   width: 186px;
    height: 32px;
	background-color: #2168CC;
	color: #FFFFFF;
	font-size: 12pt;
	border:none;
	}
	.my_button31:hover {
background-color: #F9F9F9; 
color: #000000;	
	}
      .my_button32{	
  position:absolute; 
  margin-left:-2px;
  margin-top:45px; 
   width: 156px;
    height: 60px;
	background-color: #2168CC;
	color: #FFFFFF;
	font-size: 12pt;
   }
  .my_button4{	
  position:absolute; 
  margin-left:166px;
  margin-top:-2px; 
   width: 216px;
    height: 32px;
	background-color: #F9F9F9;
	border:none;
	}
	.my_button4:hover {
background-color: #2168CC; 
color: #FFFFFF;	
	}
    .my_button41{	
  position:absolute; 
  margin-left:380px;
  margin-top:-2px; 
   width: 126px;
    height: 32px;
	background-color: #F9F9F9;
  border:none;
	}
	.my_button41:hover {
background-color: #2168CC; 
color: #FFFFFF;	
	}
     .my_button42{	
  position:absolute; 
  margin-left:505px;
  margin-top:-2px; 
   width: 183px;
    height: 32px;
	background-color: #F9F9F9;
  border:none;
	}
	.my_button42:hover {
background-color: #2168CC; 
color: #FFFFFF;	
	}
       .my_button43{	
  position:absolute; 
  margin-left:686px;
  margin-top:-2px; 
   width: 252px;
    height: 32px;
	background-color: #F9F9F9;
   border:none;
	}
	.my_button43:hover {
background-color: #2168CC; 
color: #FFFFFF;	
	} 
        .my_button44{	
  position:absolute; 
  margin-left:938px;
  margin-top:-2px; 
   width: 68px;
    height: 32px;
	background-color: #F9F9F9;
	border:none;
	}
	.my_button44:hover {
background-color: #2168CC; 
color: #FFFFFF;	
	}
    .blok1 {
	position:absolute; 
  margin-left:172px;
 }
   .blok2 {
  width:50px;
 }
  .ris{	
  position:absolute; 
  margin-left:166px;
  margin-top:33px;  
 }
 </style>
 
 
<?

$tip1 = 0;
$tip2 = 0;
$tip3 = 0;
 $var = 0;
 $priznak = 0;

 // $var 0 - начальная картинка; 1 выбран корпус; 2 выбран поэтажный план 3 выбран факультет  4 выбран объект с координатами 5 выбрано фото корпуса
 //$var 6 - выбрано управление 7 выбран кафедры  8 Приемная комиссмия 9 выбрано подразделение ; 10 кнопки Поиск 11 введен текст Поиск
// Чтение файла с корпусами
     $lines1 = file('Docvse/Organization.txt');
     $ii = 0;
     $kolkorp = count($lines1);
	$nn =0;  // кол-во выбранных фирм
    for ($i = 0; $i < $kolkorp; $i +=1)
	{
     // разбираем строку в массив
      $stroka1 = explode(';',$lines1[$i]); 
 //    echo   $stroka1[1], $stroka1[11], "<br>";
	   $ar1[$i] = $stroka1[0];  // Код места
       $ar2[$i] = $stroka1[1];  // Место
       $ar3[$i] = $stroka1[2];  // Краткое название
       $ar4[$i] = $stroka1[3];  // Полное название
	   $ar41[$i] = $stroka1[6];  // Принак наличия поэтажного плана
	   $ar42[$i] = $stroka1[7];  // Принак наличия фото корпуса
	   $ar5[$i] = $stroka1[8];  // Слева
       $ar6[$i] =  trim($stroka1[9]);  // Сверху
       $ar7[$i] = $stroka1[0];  // запас
	   $ar8[$i] = $stroka1[0];  // запас
	   $ar9[$i] = $stroka1[0];  // запас		    
	   $ar10[$i] = 0;  // информационный массив о выбранных фирмах
//	 echo  $ar1[$i], $ar2[$i], $ar5[$i], $ar6[$i],"<br>";
    }
// Чтение файла с телефонной книгой
 $lines = file('Docvse/telef.txt');

$lin = count($lines);
// echo  $lin, "<br>";
 for ($i = 0; $i < $lin; $i +=1)
{
// разбираем строку в массив
 $stroka = explode(';',$lines[$i]); 
  $f0[$i] =  $stroka[0]; // Код
  $f1[$i] =  $stroka[1];
  $f2[$i] =  $stroka[2];
  $f3[$i] =  $stroka[3];  // № корпуса
  $f4[$i] =  $stroka[4];
  $f5[$i] =  trim($stroka[5]); //  название
  $f6[$i] =  trim($stroka[6]); //  ФИО
  $f7[$i] =  $stroka[7]; //  Место
  $f8[$i] =  $stroka[8]; //  Тел внутренний
  $f9[$i] =  $stroka[9]; //  Тел 
  $f10[$i] =  $stroka[10]; //  left - координаты
  $f11[$i] =  $stroka[11]; //  top
}

// Вариант нажатия кнопки факультеты
	$t  ='s2';
	  if (isset($_POST[$t]))
   {
     $var = 3;
	}
// Вариант нажатия кнопки кафедры
	$t  ='s3';   
	  if (isset($_POST[$t]))
   {
     $var = 7;
	} 	
	// Вариант нажатия кнопки Приемная комиссмия
	$t  ='s4';   
	  if (isset($_POST[$t]))
   {
     $var = 8;
	} 
		// Вариант нажатия кнопки Поиск
	$t  ='s5';   
	  if (isset($_POST[$t]))
   {
     $var = 10;
	} 
		// Вариант нажатия ввода текста в режиме Поиск
	
	  if (isset($_POST['s6']))
   {
     $var = 11;
	
	 $tip4 = trim($_POST['s6']);
	//  echo  $var,' ',$tip4, "<br>"; 
	} 	
// Вариант нажатия кнопки управление
	$t  ='s1';    
	  if (isset($_POST[$t]))
   {
     $var = 6;
	} 
	if ($var === 3 Or $var === 6  Or $var === 7 Or $var === 8) 
	{
	 // модуль обработки факультеты управление кафедры в файле "fakult.php"
 $xx = vvod($var,$tip1,$lin,$f0,$f2,$f5);
	// echo  $tip1,' ', $var, "<br>"; 
   } 
    // Вариант нажатия кнопки конкретного подразделения
	  
 for ($i = 0; $i < $lin; $i +=1)
{
       $t  ='m'.$f0[$i];
       $f  ='f'.$f0[$i];
//	echo  $f,' ', $var, "<br>"; 
   if (isset($_POST[$f]) Or isset($_POST[$t]))
   { 
     $tip1 =$f0[$i];
	 $nazvan =$f5[$i];
	 $fio =$f6[$i];
	 $mesto =$f7[$i];
	 $telef =$f9[$i];
	 $left =$f10[$i];
	 $top =$f11[$i];
     $var = 9;
	// echo  $tip1, ' ', $f2[$i], ' ',$f3[$i], ' ', $f4[$i], ' ', $left, "<br>";
	if ($f3[$i] > 0)
    { 
	// Показываем на какой корпус стрелка на схеме кампуса
	  $ar10[$f3[$i] - 1] = 1;
	 }
	  if ($left  > 0) 
      { 
	   // Вариант нажатия показать на схеме
	    if (isset($_POST[$t]))
      {
		 $var = 4;
		 $priznak = 0;
      } 	
	  Else
	  {
	  $priznak = 1;
	   $m  ='m'.$f0[$i]; 
	   }
     //  $var = 4;
		// Ищем какой корпус для схемы корпуса
	     $tip1 = $f3[$i];
      } 
	$xx = vvod1($var,$tip1,$nazvan,$fio,$mesto,$telef,$left,$top,$lin,$f0,$f2,$f4,$f5,$f6);
	// echo  $tip1,' ',$f0[$i], "<br>"; 
   }  
 } 

// Вариант нажатия кнопки корпуса
   for ($i = 0; $i < $kolkorp; $i +=1)
  {
   $t  ='Docvse/p'.$ar1[$i];   
   if (isset($_POST[$t]))
   { 
     $tip1 =$ar1[$i];	
	 $tip2 = $ar41[$i];  // Принак наличия поэтажного плана
	 $tip3 = $ar42[$i];  // Принак наличия фото корпуса
     $var = 1;
	 $ar10[$i] = 1;
	// echo  $tip2,' ', $var, "<br>"; 
   }  
  }	
	// Вариант нажатия кнопки поэтажный план или фото корпуса
   for ($i = 0; $i < $kolkorp; $i +=1)
  {
   $r  ='Docvse/r'.$ar1[$i];   
   if (isset($_POST[$r]))
   { 
     $tip1 =$ar1[$i];	
     $var = 2;
	 $ar10[$i] = 1;
	// echo  $tip1,' ', $var, "<br>"; 
   }  
    $rr  ='Docvse/rr'.$ar1[$i];   
   if (isset($_POST[$rr]))
   { 
     $tip1 =$ar1[$i];	
     $var = 5;
	 $ar10[$i] = 1;
	// echo  $tip1,' ', $var, "<br>"; 
   }  
  }	
// Вводим имена файлов корпусов	 
 for ($i = 0; $i < $kolkorp; $i +=1)
	   { 
         $ar11[$i] = 'Docvse/f1.png';	
		 $ar12[$i] = 'Docvse/ss'.$ar1[$i].'.png';	
       }
	   
if ($var === 0  Or $var === 3   Or $var === 6  Or $var === 7  Or $var === 8)
 {
 if ($var === 0)
{
  ?>	   
<form action="../index.php" method="post" >
 <?
echo '<BUTTON  type="submit"   class="my_button1"><strong>Главная</strong></BUTTON>';
?>
</form>
<?
}
?>	
 <form action="" method="post" >
  <?
echo '<BUTTON  type="submit" name="s1"   class="my_button4"><strong>Управление и службы института</strong></BUTTON>';
echo '<BUTTON  type="submit" name="s2"   class="my_button41"><strong>Факультеты</strong></BUTTON>';
echo '<BUTTON  type="submit" name="s3"   class="my_button42"><strong>Кафедры и лаборатории</strong></BUTTON>';
echo '<BUTTON  type="submit" name="s4"   class="my_button43"><strong>Приемная комиссия и физ. тех. школа</strong></BUTTON>';
echo '<BUTTON  type="submit" name="s5"   class="my_button44"><strong>Поиск</strong></BUTTON>';
?>
</form>

<?
}
 if ($var === 1  OR $var === 2 Or $var === 3  Or $var === 4  Or $var === 5  Or $var === 6  Or $var === 7  Or $var === 8 Or $var === 9  Or $var === 10  Or $var === 11)
 {
 $r  ='Docvse/r'.$tip1; 
  
 // echo  $tip1, "<br>"; 
 ?>
 <form action="indexMIPT.php" method="post" >
 <?
echo '<BUTTON  type="submit"   class="my_button11"><strong>Сброс выбора</strong></BUTTON>';
?>
</form>
<?
  if ($priznak === 1)
  {
   ?>    
  <form action="" method="post" >
  <?
echo '<BUTTON  type="submit" name="'.$m.'"   class="my_button32"><strong>На схеме корпуса</strong></BUTTON>';
?>
  </form>
  <?
 //   
  }
}
 // кнопка поиск 
   if ($var === 10 Or $var === 11)
  {
  ?> 
    <form action="" method="post" >
<div  class="blok1">
<a><span style="color:blue">  Поиск подразделения, должности или сотрудника:  </span></a>
<input type="text" name="s6" size = 35 placeholder="Текст"/>
<input type="submit"  onchange="this.form.submit()" value="ОК" class="blok2"/> 
</div>
</form>
<?
 if ($var === 11)
 $xx = vvod2($var,$tip4,$lin,$f0,$f2,$f4,$f5,$f6);
}
  if ($var === 1 And $tip2 != 0)
  {
  ?> 
<form action="" method="post" >
<?
echo '<BUTTON  type="submit"  name="'.$r.'"  class="my_button3"><strong>Поэтажный план</strong></BUTTON>';
?>
</form>
<?
}
 if ($var === 1 And $tip3 != 0)
  {
  $rr  ='Docvse/rr'.$tip1;
//   echo  $tip2,' ', $var, "<br>"; 
  ?> 
<form action="" method="post" >
<?
echo '<BUTTON  type="submit"  name="'.$rr.'"  class="my_button31"><strong>Фото корпуса</strong></BUTTON>';
?>

</form>
<?
}
 ?>
<form action="" method="post" >
<div class="my_button21">
<?
// выводим  кнопки для корпусов
if ($var === 0 OR $var === 1 OR $var === 2  OR $var === 5  Or $var === 10)
 {
for ($i = 0; $i < $kolkorp; $i +=1)
{   
 if ($ar1[$i] === $tip1) 
  {  
    $color = 'color:red;';	
  }
  else
   $color = '';	 
    $t  ='Docvse/p'.$ar1[$i];
	echo '<BUTTON  type="submit" style="'.$color.' " name="'.$t.'"  class="my_button212"><strong>'.$ar4[$i]. '</strong></BUTTON><br/>';
  } 
 }
?>
</div> 
</form>

 <div class="ris">
 <?

 if ($var === 0 OR $var === 1 OR $var === 3 OR $var === 6  OR $var === 7  Or $var === 8 Or $var === 9   Or $var === 10  Or $var === 11)
 {
 ?>
 <span style='position:absolute;margin-left:0px;'> 
<img src="Docvse/osnova.png">
</span>
<?php 
for ($i = 0; $i < $kolkorp; $i +=1) 
{ 
// вводим теги координат имен файлов с кубиками 

 ?>   

<span style='position:absolute;z-index:<?php  echo 100000 - $ar6[$i] - $ar5[$i]; ?>;margin-left:<?php  echo  $ar5[$i]; ?>px;margin-top:<?php  echo  $ar6[$i]; ?>px'>



<img 

src="<?php   echo  $ar11[$i];    ?>" onmouseout="src='<?php   echo  $ar11[$i];    ?>'" 

  onmouseover="src='<?php   echo  $ar12[$i];    ?>'"
  
 
  alt="<?php  echo  $ar3[$i]; ?>"></span>

 <?php   
}

for ($i = 0; $i < $kolkorp; $i +=1) 
 { 
if ($ar10[$i] === 1)
  { 
// echo  $i,' ', $ar5[$i],  $ar6[$i], "<br>"; 
// встрелки
 ?>   
<span style='position:absolute;z-index:100000;margin-left:<?php  echo  $ar5[$i] + 2; ?>px;margin-top:<?php  echo  $ar6[$i] -30; ?>px'>
<img width=52 height=43
src="Docvse/STRELKA.png"></span>  
 <?php   
  }
 }
}
if ($var === 2)
 {
 $kor = 'korpys'.$tip1; 
  ?>
  <span style='position:absolute;margin-left:0px;'> 
<img src="Docvse/<?php  echo  $kor; ?>.png">
</span>
 <?php 
 }
 if ($var === 5)
 {
 $fot = 'foto'.$tip1; 
  ?>
  <span style='position:absolute;margin-left:0px;'> 
<img src="Docvse/<?php  echo  $fot; ?>.jpg">
</span>
 <?php 
 }
 ?>

</div>
 
 
			</body>
</html>

      
