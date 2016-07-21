 <HTML>
<HEAD>
<META HTTP-EQUIV="Content-Type"   target="_blank" CONTENT="text/html;charset=utf-8">
<TITLE>Схема</TITLE>
</HEAD>


	
<BODY>	

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

  if (isset($_POST['tip1']))
   {  
    $tip1 = trim($_POST['tip1'.$i]);
    //echo  $tip, "<br>";
     if ($tip1 !='');
     { 	
     If ($tip1 <> NULL)
     // Вариант с выводом статуса стенда
     $var = 1;   
     }
   }  

 
   if (isset($_POST['tip2']))
   {     
    $tip2 = trim($_POST['tip2']);
    //  echo  $tip2, "<br>";
     if ($tip2 !='');
    {   
    If ($tip2 <> NULL)
     // Вариант с выводом фирм по типу деятельности
     $var = 2;  
    }
   }
   if (isset($_POST['tip3']))
   { 
    $tip3 = trim($_POST['tip3']);
     if ($tip3 !='');
    {   
     If ($tip3 <> NULL)  
     // Вариант с выводом стендов по размерам
     $var = 3;  	
	 }
   } 
    if (isset($_POST['tip4']))
   { 
    $tip4 = trim($_POST['tip4']);
     if ($tip4 !='');
    {   
     If ($tip4 <> NULL)  
     // Вариант с выводом фирм с конкретным продуктом
     $var = 4;  	
	 }
   } 
    if (isset($_POST['tip5']))
   { 
    $tip5 = trim($_POST['tip5']);
     if ($tip5 !='');
    {   
     If ($tip5 <> NULL)  
     // Вариант с выводом фирм с конкретным продуктом
     $var = 5;  	
	 }
   } 

// echo  $tip4, "<br>";

  // Чтение файла 
     $lines1 = file('visttest/Organization.txt');
     $ii = 0;
     $kolstend = count($lines1);
	
    for ($i = 0; $i < $kolstend; $i +=1)
	{
     // разбираем строку в массив
      $stroka1 = explode(';',$lines1[$i]); 
 //    echo   $stroka1[1], $stroka1[11], "<br>";
  
 
 
	    $ar1[$i] = $stroka1[0];  // Код места
       $ar2[$i] = $stroka1[1];  // Место
       $ar3[$i] = $stroka1[2];  // Код организации (для пустых равен 1)
	   If ($ar3[$i] == 1)
	    $ii= $ii + 1;
       $ar4[$i] = $stroka1[3];  // ООО
       $ar5[$i] = $stroka1[4];  // Организация
       $ar6[$i] = $stroka1[5];  // Товар
	   $ar7[$i] = $stroka1[6];  // Группа товара
	   $ar71[$i] = $stroka1[7];  // Группа товара2
	   $ar72[$i] = $stroka1[8];  // Группа товара3
	   $ar73[$i] = $stroka1[9];  // тип размера площади
	   $ar10[$i] = $stroka1[10];  // Слева
       $ar11[$i] = $stroka1[11];  // Сверху
       $ar12[$i] = $stroka1[12];  // ширина
	   $ar13[$i] = $stroka1[13];  // высота
	   $ar14[$i] = $stroka1[14];  // файл
	   $ar15[$i] = 0;  // информационный массив о выбранных фирмах
	// echo  $ar1[$i], $ar10[$i], $ar11[$i],"<br>";
  
	
		// Обработка POST

	 // Вариант с выводом всей схемы
	 $nn =1;
  }
	
	If ($var ==1)
	{
	 // Вариант с выводом фирмы		    
	    for ($i = 0; $i < $kolstend; $i+=1)
	   {        
       if ($ar3[$i] == 1) 
	     {
		  $nn =1;
		  $ar15[$i] = 1; 
		 } 
       }
	}
	
    If ($var ==2)
	{
	 // Вариант с выводом фирмы		    
	    for ($i = 0; $i < $kolstend; $i+=1)
	   {       
	    if ($ar7[$i] ==$tip2 Or $ar71[$i] ==$tip2 Or $ar72[$i] ==$tip2) 
	     {
		  $nn =1;
		  $ar15[$i] = 1; 		 
		 } 
       }
	}

	  If ($var ==3)
	{
	 // Вариант с выводом типа фирмы		    
	    for ($i = 0; $i < $kolstend; $i+=1)
	   {       
	    if ($ar73[$i] ==$tip3) 
	     {		
		  $nn =1;
		  $ar15[$i] = 1; 
		   
		 } 
       }
	}
      If ($var ==4)
	{
 // Вариант с выводом фирм с конкретным продуктом
       $par = 1;
	    for ($i = 0; $i < $kolstend; $i+=1)
	   {     
       // Переводим все в нижний регистр 
		$str = mb_strtolower($ar6[$i], 'UTF-8'); 
        $str1 = mb_strtolower($tip4, 'UTF-8'); 
	    $pos = stripos($ar6[$i], $tip4);
       if ($pos !== false)
         {	   
         $ar15[$i] = 1; 
		 $nn =1;
		 $par = 0; 		 
		 }
		 else
		 {		 
		  $nn =0;
		  }
      }
	}
    If ($var ==5)
	{	
 // Вариант с выводом фирмы		    
	    for ($i = 0; $i < $kolstend; $i+=1)
	   {        
       if ($ar3[$i] ==$tip5) 
	    {
		  $nn =1;
		  $ar15[$i] = 1; 
		 } 
      }
	}
	
 if ($nn ==0)
  echo 'Организаций с заданными условиями поиска не найдено','<br/>';
  $nn ==0; // кол-во выбранных фирм

// Чтение файла с типами1
$lines = file('visttest/spisok.txt');
 for ($i = 0; $i < count($lines); $i +=1)
{
// разбираем строку в массив
 $stroka = explode(';',$lines[$i]); 
  $arr01[$i] =  trim($stroka[0]); 
  $arr1[$i] =  trim($stroka[1]); 
  
  //    echo $arr[$i], "<br>";  
}

// Чтение файла с размерами
$lines = file('visttest/Sbroc razmera.txt');
 for ($i = 0; $i < count($lines); $i +=1)
{
// разбираем строку в массив
 $stroka = explode(';',$lines[$i]); 
  $arr02[$i] =  trim($stroka[0]); 
  $arr2[$i] =  trim($stroka[1]); 
  
//      echo $arr02[$i], "<br>";  
}



// 
?>
<style>

.my_button1 {
   
margin-left:5px;
	
    width: 130px;
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

  margin-left:13px;

 }
.blok2 {	
 
  margin-left:13px;

  width:200px;
border-top: 1px solid blue;
border-right: 3px solid blue;
border-bottom: 3px solid blue;
border-left: 1px solid blue;
 }
 .blok3 {	

  margin-left:13px;
 
  width:200px;
border-top: 1px solid blue;
border-right: 3px solid blue;
border-bottom: 3px solid blue;
border-left: 1px solid blue;
 }
 .blok4 {	
 
  margin-left:13px;
 
  width:200px;
border-top: 1px solid blue;
border-right: 3px solid blue;
border-bottom: 3px solid blue;
border-left: 1px solid blue;
 }
  .blok5 {	
 
  margin-left:13px;
 
  width:200px;
border-top: 1px solid blue;
border-right: 3px solid blue;
border-bottom: 3px solid blue;
border-left: 1px solid blue;
 }
  .ris{	
  position:absolute; 
  margin-left:217px;
  margin-top:0px; 
 }
  .ris1{	
  position:absolute; 
  margin-left:225px;
  margin-top:855px; 	 

 }
</style>
<div class="ris">



<span style='position:absolute;margin-left:0px;margin-top:0px'> 
<img src="visttest/image200.png">
</span>

<?php 
// Вывели подложку
//Задаем названия кубиков
for ($i = 0; $i < $kolstend; $i+=1)
	   {  
	 
         if ($ar15[$i] == 0)
            {           
            $ar16[$i] = 'visttest/Docvse/f'.$ar1[$i].'.png';				
			 if ($ar3[$i] > 1)
              $ar17[$i] = 'visttest/Docvse/s'.$ar1[$i].'.png';	
			  Else
			  $ar17[$i] = 'visttest/Docvse/s200.png';	
		    }
		 Else		  
            {
             If ($var ==1)	
              {			 
	           $ar16[$i] = 'visttest/Docvse/i'.$ar1[$i].'.png';			
			   $ar17[$i] = 'visttest/Docvse/s200.png';
               }
              Else
			  {			 
	           $ar16[$i] = 'visttest/Docvse/w'.$ar1[$i].'.png';			
			   $ar17[$i] = 'visttest/Docvse/s'.$ar1[$i].'.png';
               }
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
 ?>	   

</div>
<div  class="ris1">
<?php  
if ($par ==0)
{
if ($var ==2 Or $var ==4 Or $var ==5)
{
echo '<table border="1">';
  echo '</tr>';
 
  

echo '<td align="center" valign="middle" bgcolor="#00FFFF">Перечень организаций</td> <td align="center" valign="middle" bgcolor="#00FFFF">Место на выставке</td>  <td align="center" valign="middle" bgcolor="#00FFFF">Деятельность</td>';

  echo '</tr>';
 
for ($i = 0; $i <$kolstend; $i +=1)
{


  if ($ar15[$i] > 0)
  {  
    echo '<tr>';
    echo '<td align="center" valign="middle" >' . $ar5[$i]. '</td>'.'<td align="center" valign="middle" >' . $ar2[$i]. '</td>'.'<td>' . $ar6[$i]. '</td>';
    echo '</tr>';
   } 
 
}

echo '</table>';
}
}
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
   $color = 'style="color:red"';   
    else
   $color = '';
?>
<input type="radio" name="tip0"  onchange="this.form.submit()" value="vse" /><span <?php echo $color; ?> >Все стенды</span>
</div>
<?

 if ($tip1==2)  
   $color = 'style="color:red"';   
    else
   $color = '';
?>
<div  class="blok1">
<input type="radio" name="tip1" onchange="this.form.submit()" value=2  ><span <?php echo $color; ?> >Стенд свободен</span><br/>
</div>
<br>
<div class="blok2">
<a>Выберите тематический раздел:</a>
<?
echo '<br/>';
// выводим  список типов
$n = count($arr01);
for ($i = 0; $i <$n; $i +=1)
{ 
  if ($arr01[$i] ==$tip2)
  {
   $color = 'style="color:red"';
  }
  else
   $color = '';
	echo '<input type="radio" name="tip2"  onchange="this.form.submit()" value='.$arr01[$i].'  ><span ' .$color.' >'.$arr1[$i]. '</span><br/>';
} 
?>
</div>
<br>
<div  class="blok3">
<a>Выберите размер стенда:</a>
<?
echo '<br/>';
// выводим  список типов
$n = count($arr02);
for ($i = 0; $i <$n; $i +=1)
{  
    if ($arr02[$i] ==$tip3)
  {
   $color = 'style="color:red"';
  }
  else
   $color = '';
	echo '<input type="radio" name="tip3"  onchange="this.form.submit()" value='. $arr02[$i].'  ><span ' .$color.' >'.$arr2[$i]."кв.м".  '</span><br/>';	
} 
?>
</div>
<br>
<div  class="blok4">
<?
 if ($tip4 !='')
   $color = 'style="color:red"';   
    else
   $color = '';
?>
<a><span <?php echo $color; ?> >Для поиска товара, продукта или услуги введите название или его часть:</span></a>
<input type="text" name="tip4" size = 20 placeholder="Продукт"/>
<input type="submit"  onchange="this.form.submit()" value="ОК" /> 
</div>
<br/>
<div  class="blok5">
<a>Выберите фирму-участника:</a>
<?php 
// Выводим  список фирм
$n = count($ar3);

for ($i = 0; $i <$n; $i +=1)
{
if ($ar3[$i] != 1)
 {
   if ($ar3[$i] ==$tip5)
  {
   $color = 'style="color:red"';
  }
  else
   $color = '';
  echo '<input type="radio" name="tip5"  onchange="this.form.submit()" value='. $ar3[$i].'><span ' .$color.' >'.$ar5[$i]. '</span><br/>';
 }
}

?>
</div>
<br/> <br/>
</form>



			</body>
</html>

      
