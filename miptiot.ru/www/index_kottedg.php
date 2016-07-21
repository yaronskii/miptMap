 <HTML>
<HEAD>
<META HTTP-EQUIV="Content-Type"   target="_blank" CONTENT="text/html;charset=utf-8">
<TITLE>Схема</TITLE>
</HEAD>
<body>

<?
// Чтение файла с типами1
$lines = file('kottedg/tip1.txt');
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
$lines = file('kottedg/tip2.txt');
$lin2 = count($lines);
 for ($i = 0; $i < $lin2; $i +=1)
{
// разбираем строку в массив
 $stroka = explode(';',$lines[$i]); 
   $arr02[$i]  = $stroka[0];
   $arr2[$i] = $stroka[1];    
  //    echo $arr[$i], "<br>";  
}
// Чтение файла с типами3
$lines = file('kottedg/tip3.txt');
$lin3 = count($lines);
 for ($i = 0; $i < $lin3; $i +=1)
{
// разбираем строку в массив
 $stroka = explode(';',$lines[$i]); 
   $arr03[$i]  = $stroka[0];
   $arr3[$i] = $stroka[1];    
   
}
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
   // Вариант с выводом размера участка
    for ($i = 0; $i < $lin2; $i +=1)
  {
   $t  ='m'.$arr02[$i];   
   if (isset($_POST[$t]))
   { 
    $t2 = trim($_POST[$t]);
     $tip2 =$arr02[$i];	
     $var = 1;
   }  
  }
// Вариант с выводом типа дома
  for ($i = 0; $i < $lin3; $i +=1)
  {
   $t  ='n'.$arr03[$i]; 
   if (isset($_POST[$t]))
   { 
    $t3 = trim($_POST[$t]);

     $tip3 =$arr03[$i];	
     $var = 1;  	
//	 echo  $var, "<br>"; 
   }  
  }
  
}
// Чтение файла 
     $lines1 = file('kottedg/Organization.txt');
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
    //    echo  $ar7[$i], $tip2,"<br>";	   
    // echo strcmp($ar7[$i], $tip2),"<br>";	

	
       if ( $ar6[$i] === $tip2 Or $ar8[$i] === $tip3 Or $ar4[$i] === $tip1) 
	    {	
		  $nn =1;
		  $ar15[$i] = 1; 
		 } 
      }
	}


   
// Обработка POST

 if ($nn ==0)
  echo 'Организаций с заданными условиями поиска не найдено','<br/>';
 

	
// Чтение файла с типами1
$lines = file('kottedg/tip1.txt');
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
  
margin-left:5px;
	
    width: 186px;
    height: 25px;
	background-color: #7DDEFF; 
	font-size: 12pt;
	
}

.blok0 {	
 
  margin-left:13px;
 
 }

 
  .ris{	
  position:absolute;
 
  margin-left:191px;
  margin-top:0px; 	 

 }
</style>
<div class="ris">
<span style='position:absolute;margin-left:0px;margin-top:0px'> 
<img src="kottedg/image200.png">
</span>

<?php 
// Вывели подложку
for ($i = 0; $i < $kolstend; $i+=1)
	   {  
	 
         if ($ar15[$i] == 0)
          {	   
            $ar16[$i] = 'kottedg/Docvse/f'.$ar1[$i].'.png';		   
		  }
		 Else		  
          {  		      
		    $ar16[$i] = 'kottedg/Docvse/w'.$ar1[$i].'.png';
		  }	
		  if ($ar8[$i] == 1)
          {	   
             $ar17[$i] = 'kottedg/Risunok/tip3_1.png';		   
		  }
		   if ($ar8[$i] == 2)
          {	   
             $ar17[$i] = 'kottedg/Risunok/tip3_2.png';		   
		  }
		   if ($ar8[$i] == 3)
          {	   
             $ar17[$i] = 'kottedg/Risunok/tip3_3.png';		   
		  }
		    if ($ar8[$i] == 4)
          {	   
             $ar17[$i] = 'kottedg/Risunok/tip3_4.png';		   
		  }
       //   echo   $ar2[$i], $ar16[$i],  "<br>"; 		  
       }
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
// Выводим подложку
 ?>	   
</div>  


<form action="index.php" method="post" >
<input type="submit" value="Главная" class="my_button1"/> 
 
</form>

<form action="" method="post" >
<div class="blok0">
<?
$color = '';
 if ($tip !='')
 {
   $color = 'style="color:red"'; 
  
   }
?>
<input type="radio" name="tip0"  onchange="this.form.submit()" value="vse" /><span <?php echo $color; ?> >Все участки</span>
</div>
<br/>

<span style='position:absolute;margin-left:20px;> '> 
<strong>   <FONT  COLOR="#3300DD"> Выберите статус:</FONT> </strong></span>
<br/>
<?
// выводим  кнопки
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
  echo '<BUTTON  type="submit" style=" height:38px; width:186px; margin-left:5px; vertical-align: left;'.$color.' font-size: 12px" name="'.$t.'" ><strong>'.$arr1[$i]. '</strong></BUTTON><br/>';
  } 
?>
</div>
<br/>
<span style='position:absolute;margin-left:20px;> '> 
<strong>   <FONT  COLOR="#3300DD"> Выберите размер:</FONT> </strong></span>
<br/>
<?

 $n = count($arr02);
for ($i = 0; $i <$n; $i +=1)
{   
 if ($arr02[$i] === $tip2) 
  {  
    $color = 'color:red;';	
  }
  else
   $color = '';	 
    $t  ='m'.$arr02[$i];
  echo '<BUTTON  type="submit" style=" height:38px; width:186px; margin-left:5px; vertical-align: left;'.$color.' font-size: 12px" name="'.$t.'" >'.$arr2[$i]. '</BUTTON><br/>';
  } 
?>
</div>
<br/>


<span style='position:absolute;margin-left:13px;> '> 
<strong>   <FONT  COLOR="#3300DD"> Выберите тип дома:</FONT> </strong></span>
<br/>
<?
// выводим  список типов
 $n = count($arr03);
for ($i = 0; $i <$n; $i +=1)
{   
 if ($arr03[$i] === $tip3) 
  {  
    $color = 'color:red;';	
  }
  else
   $color = '';	 
    $t  ='n'.$arr03[$i];
  echo '<BUTTON  type="submit" style=" height:38px; width:186px; margin-left:5px; vertical-align: left;'.$color.' font-size: 12px" name="'.$t.'" >'.$arr3[$i]. '</BUTTON><br/>';
  } 
?>
    </form> 
			</body>
</html>

      
