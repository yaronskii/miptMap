 <?php
 
function vvod($tip1,$tip2,$r,$tt,$tttt)
{
// echo  $tip1,$tip2,$r,$tt,$tttt;
if ($tt=== "Подробнее")
  {  
    $tt = 'Витрина 1';
     $tttt = 1;		
  }
// echo  $r;
// Чтение файла с витринами
$lines = file('muzej/zal.txt');
$lin1 = count($lines);
 for ($i = 0; $i < $lin1; $i +=1)
{
// разбираем строку в массив
 $stroka = explode(';',$lines[$i]); 
  $t01[$i] =  trim($stroka[0]); 
  $t1[$i] =  trim($stroka[1]);  
}
 // echo $r, "<br>"; 
$tipv = 1;


  ?>
  <style>

.my_button {
position:absolute; 
  margin-left:5px;
  margin-top:-3px; 
    width: 186px;
    height: 30px;
	background-color: #7DDEFF; 
	font-size: 12pt;
 } 
 
 .my_text{
  position:absolute; 
  margin-left:191px;
  margin-top:0px;  
width:1040px;
height:707px;
padding: 40px;
background-color: #FFFFF1; 
 }
 .my_button211 {
position:absolute; 
  margin-top:45px;
}
 .my_button2112 {
height:35px;
 width:186px;
 margin-bottom:7px;
 margin-left:5px; 
 vertical-align: left;
 font-size: 12pt;
 background-color: #FFDEAD; 
}
 </style>
 <form action="index_muzej.php" method="post" >
<input type="submit" value="Выбор зала" class="my_button"/> 
</form> 


<div class="my_button211">

<form action="" method="post" >
<?
// выводим  кнопки для витрин
$n = count($t01);
for ($i = 0; $i <$n; $i +=1)
{ 
// echo  $t01[$i],$tttt;

 if ($t01[$i]=== $tttt)
  {  
    $color = 'color:red;';	
  }
  else
   $color = '';	 

//	echo  $r;
?>
<input type="submit" value="<?php  echo  $t1[$i]; ?>"  name="<?php  echo  $r; ?>"  class="my_button2112"/></br> 
<?
  } 
?>
</form> 
</div>

<div class="my_text">
<!--  пример с отступами и выравниванием по левому краю-->
<FONT SIZE="+2" COLOR="blue"><?php  echo $tip2.'.     '.$tt; ?></FONT></br> 
 <img src="muzej/Risunok/t<?php  echo  $tttt; ?>.JPG"  hspace="8" vspace="10" align="left">
 <?
 // Чтение файла с текстами витрин
 $tttt = 1;  // Убрать когда будут все файлы с текстами
include('muzej/Risunok/text'.$tttt.'.txt');
?>
</div>

<!--  Рисуем рамку-->
 <img src="muzej/Risunok/lin0.jpg" style=" position:absolute; 
  margin-left:196px;
  margin-top:0px; ">
  <img src="muzej/Risunok/lin1.jpg" style=" position:absolute; 
  margin-left:1275px;
  margin-top:0px; ">
  <img src="muzej/Risunok/lin2.jpg" style=" position:absolute; 
  margin-left:1275px;
  margin-top:748px; ">
   <img src="muzej/Risunok/lin3.jpg" style=" position:absolute; 
  margin-left:196px;
  margin-top:748px; ">
   <?
  for ($i = 0; $i <19; $i +=1)
{ 
$ll = 230 + $i*55;
?>
  <img src="muzej/Risunok/lin00.jpg" style=" position:absolute; 
  margin-left:<?php  echo  $ll; ?>px;
  margin-top:2px; ">
   <img src="muzej/Risunok/lin22.jpg" style=" position:absolute; 
  margin-left:<?php  echo  $ll; ?>px;
  margin-top:755px; ">
 <?php
  }
   for ($i = 0; $i <13; $i +=1)
{ 
$ll = 34 + $i*55;
?>
  <img src="muzej/Risunok/lin33.jpg" style=" position:absolute; 
  margin-left:197px;
  margin-top:<?php  echo  $ll; ?>; ">
   <img src="muzej/Risunok/lin11.jpg" style=" position:absolute; 
  margin-left:1283px;
  margin-top:<?php  echo  $ll; ?>px; ">
 <?php
  }
 ?> 
 
 

  <?php
return;
}
?>

 
	 