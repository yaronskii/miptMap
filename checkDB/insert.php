<!-- Include Database connections info. -->

<!-- Verify if user exists for login -->
<?php
$mysqli = new mysqli('localhost', 'root', '1', 'mybase');
if(isset($_GET['site_url']) && isset($_GET['site_name'])){
$url= $_GET['site_url'];
$sitename= $_GET['site_name'];
$insertSite_sql = 'INSERT INTO SITE (site_url, site_name) VALUES('. $url. ',' . $sitename. ')';
$insertSite= mysql_query($insertSite_sql) or die(mysql_error());
<!-- If is set URL variables and insert is ok, show the site name -->
echo $sitename;
} else { 
echo 'Error! Please fill all fileds!';
}
?>