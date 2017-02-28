<!--
To change this template, choose Tools | Templates
and open the template in the editor.
-->
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Liste des faits divers</title>
        <link href="css/list.css" media="all" rel="stylesheet" type="text/css" />
        <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
        <script src="http://code.jquery.com/jquery-migrate-1.2.1.js"></script>
        <script type="text/javascript" src="js/common.js"></script>
        <script type="text/javascript">
            var sc_project=7349747; 
            var sc_invisible=1; 
            var sc_security="fd05fc3c"; 
        </script>
        <script type="text/javascript" src="http://www.statcounter.com/counter/counter.js"></script>
        <script type="text/javascript">
            year = undefined;
            month = undefined;
            invert = undefined;
<?php
try {
    if (!empty($_GET['year'])) {
        $year_ = intval($_GET['year']);
        if ($year_ < 2020 && $year_ > 2009) {
            echo 'year = '. $year_.';';
            $month_str = $_GET['month'];
            if (!empty($_GET['month']) || $month_str != null) {
                $month_ = intval($_GET['month']);
                if ($month_ < 12 && $month_ >= 0) {
                    echo 'month=' . $month_ . ';';
                }
            }
        }
    }
    if (!empty($_GET['invert'])) {
        echo 'invert=true;';
    }
} catch (Exception $exc) {
    
}
?>
        </script>
        <script type="text/javascript">

            function iframeResize() {
                
                var ifrdiv = $('#FDIframe0');
                var iframe = $('#iframe_FDIframe0');
                
                
                iframe.attr('width', 500)
            }
            function loadList() {
                var tableName = '14KaGvp7V8tEYv8j7Q8IVZShkp7fPa-j0pJ5fVXo';
                if(year == undefined || month == undefined) {
                    var curDate = new Date();
                    year = curDate.getUTCFullYear();
                    month = curDate.getUTCMonth();
                    console.log("Get default date -> "+month+"/"+year)
                }
                var sql = "SELECT ID, DATE, TITRE, SRC_LIEN"
                    + " FROM " + tableName
                    + " WHERE ANNEE=" + year
                    + " AND MOIS=" + month
                    + " AND ETAT=1";
                if(invert) {
                    sql += " ORDER BY DATE DESC";
                } else {
                    sql += " ORDER BY DATE ASC";
                }
//                    + " AND EDITEUR='KAOS'"
                    
//                console.log('load articles: '+sql);
                mds.common.fusionTableQuery(
                sql, 
                function(rows) {
                    displayList(rows);
                },
                function(status, error) {
                    console.log('error: '+status+', error='+error);
                }
            )}
            function displayList(rows) {
                var articles = rows;
                var mapUrl = '';
                var html = '';
                var curDay = undefined;
                for(i=0; i < articles.length; i++) {
                    var article = new Object();
                    article.id = articles[i][0];
                    article.date = articles[i][1];
                    article.titre = articles[i][2];
                    article.src_lien = articles[i][3];
                    var date = new Date(parseInt(article.date));
                    var day = date.getDate();
                    var newPar = !curDay || day != curDay;
                    if(newPar) {
                        if(i > 0) {
                            html += '</p>';
                        }
                        html += '<p>';
                    }   
                    html += '<span class="list_date">' + mds.common.addZero(day, 2) 
                        + '/' + mds.common.addZero(date.getMonth()+1, 2) + ':</span>';
                    html += '<span class="list_title">'+article.titre+' |</span>';
                    html += ' <a class="list_link" href="'+article.src_lien+'" target="_blank">'
                        + 'source'
                        + '</a>'
                        + '<a href="'+mapUrl+'index.php?id='+article.id+'" target="_blank">'
                        + '<img class="list_img" src="img/map.jpg" />'
                        +'</a>'
                        + '<br/>';
                    curDay = day;
                }
                $('#loader').css('display', 'none');
                $('#fd_article_list').html(html);
            }
            $(function() {
                loadList();
            });
        </script>
    </head>
    <body>        
        <div id="loader">
            <img src="img/vloader.gif">
        </div>
        <div id="fd_article_list" style="height: 480px; overflow: auto;">
            
        </div>
    </body>
</html>
