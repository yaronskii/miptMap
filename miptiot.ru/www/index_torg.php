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
     // Вариант с выводом конкретной фирмы
     $var = 5;  	
	 }
   } 

// echo  $tip5, "<br>";

  // Чтение файла 
     $lines1 = file('torg_dom/Organization.txt');
     $ii = 0;
     $kolstend = count($lines1);
	
    for ($i = 0; $i < $kolstend; $i +=1)
	{
     // разбираем строку в массив
      $stroka1 = explode(';',$lines1[$i]); 
 //    echo   $stroka1[1], $stroka1[11], "<br>";
  
  	   $arr20[$i] = $stroka1[0];  // Код места
       $arr21[$i] = $stroka1[1];  // Место
       $arr22[$i] = $stroka1[2];  // Код организации (для пустых равен 1)
       $arr23[$i] = $stroka1[3];  // ООО
       $arr24[$i] = $stroka1[4];  // Организация
       $arr25[$i] = $stroka1[5];  // Товар
	   $arr26[$i] = $stroka1[6];  // Группа товара
	   $arr27[$i] = $stroka1[7];  // Слева
       $arr28[$i] = $stroka1[8];  // Сверху
       $arr29[$i] = $stroka1[9];  // ширина
	   $arr30[$i] = $stroka1[10];  // высота
	   $arr31[$i] = $stroka1[11];  // файл
  
	
		// Обработка POST

	 // Вариант с выводом всей схемы
	
  }
	 $nn =1;
	If ($var ==0)
	{
	 // Вариант с выводом всей схемы
	 $nn =1;
	}
	
	If ($var ==5)
	{
	 // Вариант с выводом фирмы		    
	    for ($i = 0; $i < $kolstend; $i+=1)
	   {        
       if ($arr22[$i] ==$tip5) 
	    {
		  $nn =1;
		  $arr32[$i] = 1; 
		 } 
      }
	}
	
	If ($var ==2)
	{
	
	 // Вариант с выводом фирм по типу деятельности		 
	    for ($i = 0; $i < $kolstend; $i+=1)
	   { 	 
       if ($arr26[$i] == $tip2 And $arr22[$i] > 1)  
         {	
         
		  $arr32[$i] = 1;  
          $nn =1;
          }		  
      }
	}
	
	If ($var ==4)
	{
	 // Вариант с выводом фирм с конкретным продуктом

	    for ($i = 0; $i < $kolstend; $i+=1)
	   { 
        // Переводим все в нижний регистр 
		$str = mb_strtolower($arr25[$i], 'UTF-8'); 
      $str1 = mb_strtolower($tip4, 'UTF-8'); 
   
	//  echo  $str,$str1, "<br>";
	
	   $pos = stripos($str, $str1);
       if ($pos !== false)
         {	   
         $arr32[$i] = 1; 
		 $nn =1;
		 }		
      }
	}

 if ($nn ==0)
  echo 'Организаций с заданными условиями поиска не найдено','<br/>';
  $nn ==0; // кол-во выбранных фирм

// Чтение файла с типами1
$lines = file('torg_dom/spisok.txt');
 for ($i = 0; $i < count($lines); $i +=1)
{
// разбираем строку в массив
 $stroka = explode(';',$lines[$i]); 
  $arr01[$i] =  trim($stroka[0]); 
  $arr1[$i] =  trim($stroka[1]); 
  
  //    echo $arr[$i], "<br>";  
}

?>
<style>

.my_button1 {
   
margin-left:5px;
	
    width: 130px;
    height: 25px;
	background-color: #7DDEFF; 
	font-size: 12pt;
	
}

.blok0 {	

  margin-left:13px;
 
 }

.blok2 {	
 
  margin-left:13px;
 background-color: #C5EFF4;
  width:200px;
border-top: 1px solid blue;
border-right: 3px solid blue;
border-bottom: 3px solid blue;
border-left: 1px solid blue;
 }

 .blok4 {	
  background-color: #C5EFF4;
  margin-left:13px;
 
  width:200px;
border-top: 1px solid blue;
border-right: 3px solid blue;
border-bottom: 3px solid blue;
border-left: 1px solid blue;
 }
  .blok5 {	
  background-color: #C5EFF4;
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
<img src="torg_dom/image200.png">
</span>

<?php 
// Вывели подложку
//Задаем названия кубиков
for ($i = 0; $i < $kolstend; $i+=1)
	   {  
         if ($arr22[$i] == 1)
          {	   
           $arr33[$i] = 'torg_dom/Docvse/f'.$arr20[$i].'.png';
		   $arr34[$i] = 'torg_dom/Docvse/s200.png';
		   }
		   Else
		     if ($arr32[$i] == 0)
             {	  
		       $arr33[$i] = 'torg_dom/Docvse/f'.$arr20[$i].'.png';
			   $arr34[$i] = 'torg_dom/Docvse/s'.$arr20[$i].'.png';
		     }
			 Else
			 {
			 $arr33[$i] = 'torg_dom/Docvse/w'.$arr20[$i].'.png';
			 $arr34[$i] = 'torg_dom/Docvse/s'.$arr20[$i].'.png';
			 }
	// echo  $i, $arr33[$i], "<br>"; 
    }

	


for ($i = 0; $i < $kolstend; $i +=1) 
{ 

// вводим теги координат имен файлов с кубиками и гиперссылки
 ?>   
<span style='position:absolute;z-index:<?php  echo 100000 - $arr28[$i] - $arr27[$i]; ?>;margin-left:<?php  echo  $arr27[$i]; ?>px;margin-top:<?php  echo  $arr28[$i]; ?>px'>

<img 
 src="<?php   echo  $arr33[$i];    ?>" onmouseout="src='<?php   echo  $arr33[$i];    ?>'" 
  onmouseover="src='<?php   echo  $arr34[$i];    ?>'" 
  alt="<?php  echo  $arr21[$i]; ?>"></a></span>   
 <?php   
}

for ($i = 0; $i < $kolstend; $i +=1) 
{ 
if ($arr32[$i] == 1)
 {
// встрелки
 ?>   
<span style='position:absolute;z-index:100000;margin-left:<?php  echo  $arr27[$i] - 2; ?>px;margin-top:<?php  echo  $arr28[$i] -30; ?>px'>
<img width=42 height=35
src="torg_dom/STRELKA.png"></span>  
 <?php   
  }
}
 ?>

</div>
	

<div  class="ris1">
<table border="1">
<tr>
<td align="center" valign="middle" bgcolor="#00FFFF">Перечень организаций</td> <td align="center" valign="middle" bgcolor="#00FFFF">Место в ТЦ</td>  <td align="center" valign="middle" bgcolor="#00FFFF">Деятельность</td>
</tr>
<?php  

for ($i = 0; $i <$kolstend; $i +=1)
{
if ($var ==0  And $arr22[$i] > 1)
 {  
  echo '<tr>';
  echo '<td align="center" valign="middle" >' . $arr24[$i]. '</td>'.'<td align="center" valign="middle" >' . $arr21[$i]. '</td>'.'<td>' . $arr25[$i]. '</td>';
  echo '</tr>';
  }
  Else
  {
    if ($arr32[$i] == 1 And $arr22[$i] > 1)
	{
	 echo '<tr>';
     echo '<td align="center" valign="middle" >' . $arr24[$i]. '</td>'.'<td align="center" valign="middle" >' . $arr21[$i]. '</td>'.'<td>' . $arr25[$i]. '</td>';
     echo '</tr>';
	}
  }
}
?>
</table>
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
<input type="radio" name="tip0"  onchange="this.form.submit()" value="vse" /><span <?php echo $color; ?> >Все организации</span>
</div>
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
<a ALIGN="center">Выберите одну из организаций:</a>
<br/>
<?php 
// Выводим  список фирм
$n = count($arr22);

for ($i = 0; $i <$n; $i +=1)
{
if ($arr22[$i] != 1)
 {
   if ($arr22[$i] ==$tip5)
  {
   $color = 'style="color:red"';
  }
  else
   $color = '';
  echo '<input type="radio" name="tip5"  onchange="this.form.submit()" value='. $arr22[$i].'><span ' .$color.' >'.$arr24[$i]. '</span><br/>';
 }
}
?>
</div>
<br/> <br/>
</form>


			</body>
</html>

      
