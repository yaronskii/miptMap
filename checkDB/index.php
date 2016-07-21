<!-- Include AJAX Framework -->
<script src="ajax/ajax_framework.js" language="javascript"></script>
<!-- Show Message for AJAX response -->
<div id="insert_response"></div>
<!-- Form: the action="javascript:insert()"calls the javascript function "insert" into ajax_framework.js -->
<form action="javascript:insert()" method="post">
<input name="site_url" type="text" id="site_url" value=""/>
<input name="site_name" type="text" id="site_name" value=""/>
<input type="submit" name="Submit" value="Insert"/>
</form>