 <?php
 
function vvod($var,$tip1,$lin,$f0,$f2,$f5)
{
// echo  $lin,$f0[55],$f5[55];

 ?>
  <style>
.my_button211 {
position:absolute; 
  margin-top:35px;
}
.my_button212 {

 width:170px;
 margin-left:-5px;
 z-index:2;
margin-bottom:3px;
 font-size:9pt;
 vertical-align: left;
 	border:none;
	}
	.my_button212:hover {
background-color: #2168CC; 
color: #FFFFFF;	
	}
 </style>
 <div class="my_button211">

<form action="" method="post" >
<?
// выводим  кнопки для факультетов

if ( $var === 3)
 { $rr = '1'; }
 if ( $var === 6)
 {$rr = '6';}
 if ( $var === 7)
 {$rr = '2';}
 if ( $var === 8)
 {$rr = '7';}
for ($i = 0; $i <$lin; $i +=1)
{ 
// echo  $t01[$i],$tttt;
 if ( $f2[$i]=== $rr)
  {  
$r = 1;


if ($f0[$i] === $tip1) 
  {  
    $color = 'color:red;';	
  }
  else
   $color = '';	
   //  изменение высоты кнопки
  $hhh = 'height:44px; '; 
  if (strlen($f5[$i]) > 120)
 {  
   $hhh = 'height:95px; ';
  }
 // echo strlen($f5[$i]), "<br>"; 
$f  ='f'.$f0[$i];
// echo $f5[$i],$f, "<br>"; 
  echo '<BUTTON  type="submit" style="'.$hhh.' '.$color.'" class="my_button212"  name="'.$f.'">'.$f5[$i].'</BUTTON><br/>';

   }
  } 
?>
</form> 
</div>
<? 

return;
}



function vvod1($var,$tip1,$nazvan,$fio,$mesto,$telef,$left,$top,$lin,$f0,$f2,$f4,$f5,$f6)
{
// echo  $lin;
$tel = 'ТЕЛ: '.$telef;
if ($telef == NULL) 
  {  
    $tel = '';	
  }
 ?>
  <style>
.my_button211 {
position:absolute; 
  margin-top:35px;
}
.my_button212 {
height:44px;
 width:170px;
 margin-left:-5px;
 z-index:2;
margin-bottom:3px;
 font-size:9pt;
 vertical-align: left;
 	border:none;
	}
	.my_button212:hover {
background-color: #2168CC; 
color: #FFFFFF;	
	}
 .ris1{	
  position:absolute; 
  margin-left:2px;
  margin-top:33px;  
 }
 </style>
 <span style='position:absolute;margin-left:180px;margin-top:-2px;line-height: 0.9em;> '> 
<strong>   <FONT  COLOR="#3300DD"><? echo  $nazvan.'  '.$fio.'  '.$mesto.'  '.$tel; ?></FONT> </strong></span>
 <div class="my_button211">

<form action="" method="post" >
<?
// выводим  кнопки для факультетов

for ($i = 0; $i <$lin; $i +=1)
{ 
 if ( $f4[$i]=== $tip1 And $f2[$i]<> '1')
  {  
$r = 1;


if ($f0[$i] === $tip1) 
  {  
    $color = 'color:red;';	
  }
  else
   $color = '';	
 //  изменение высоты кнопки
 
  if (strlen($f5[$i]) < 80)
 {  
   $hhh = 'height:44px; ';
  }
  else
$hhh = 'height:80px; ';	      
$f  ='f'.$f0[$i];
$ggg  =$f5[$i].' '.$f6[$i];
// echo $f5[$i],$f, "<br>"; 
  echo '<BUTTON  type="submit" style="'.$hhh.' '.$color.'" name="'.$f.'"  class="my_button212">'.$ggg.'</BUTTON><br/>';

   }
  } 
?>
</form> 
</div>
<div class="ris1">
<? 
if ($var === 4)
 {
 $kor = 'korpys'.$tip1; 
  ?>
  <span style='position:absolute;margin-left:0px;'> 
<img src="Docvse/<?php  echo  $kor; ?>.png">
</span>
 
<span style='position:absolute;z-index:100000;margin-left:<?php  echo  $left + 3; ?>px;margin-top:<?php  echo  $top -30; ?>px'>
<img width=52 height=43
src="Docvse/STRELKA.png"></span>  
 <?php 
 }
// стрелки
 ?>   
 </div>
  <?php 
return;
}


function vvod2($var,$tip4,$lin,$f0,$f2,$f4,$f5,$f6)
{
	// Вариант с вводом в режиме поиск
?>	
  <style>
  .my_button211 {
  position:absolute; 
  margin-top:35px;
  }
  .my_button212 {
height:44px;
 width:170px;
 margin-left:-5px;
 z-index:2;

 font-size:9pt;
 vertical-align: left;
 	border:none;
	}
	.my_button212:hover {
background-color: #2168CC; 
color: #FFFFFF;	
	}
 </style>
 <div class="my_button211">

<form action="" method="post" >
<?php
      // выводим  кнопки для Фамилий и должностей
 // echo $var,' ',$tip4, "<br>"; 
    for ($i = 0; $i <$lin; $i +=1)
    { 
	$ggg  =$f5[$i].' '.$f6[$i];
       // Переводим все в нижний регистр 
		$str = mb_strtolower($ggg, 'UTF-8'); 
        $str1 = mb_strtolower($tip4, 'UTF-8'); 
	    $pos = stripos($str, $str1);
       if ($pos !== false)
         {	
      $f  ='f'.$f0[$i];
     
// echo $f5[$i],$f, "<br>"; 
  echo '<BUTTON  type="submit" style="'.$color.' " name="'.$f.'"  class="my_button212">'.$ggg.'</BUTTON><br/>';		 
       // echo $f6[$i],' ',$tip4, "<br>"; 
		 }
    } 
	
		?>
</form> 
</div> 
<?php
	return;
}  
?>	 