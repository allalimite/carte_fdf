<!DOCTYPE html>
<html style="height: 100%"> 
    <head>
        <title>France - Revue de presse des faits divers</title>
        <!--<META HTTP-EQUIV="expires"CONTENT="0">-->
        <meta name="description" content="Carte interractive de la délinquance; France; statistiques de la délinquance">
        <meta name="keywords" content="delinquance, délinquance, carte, interractive, France, statistiques, faits divers, crimes, délis, insécurité, incivilité">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="icon" type="image/png" href="img/blason_small.png" />
        <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.1/normalize.min.css"/>
        <link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.24/themes/smoothness/jquery-ui.css"/>
        <link rel="stylesheet" href="css/map.css" type="text/css" media="all" />
        <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
        <!-- Optional theme -->
        <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css">
        <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
        <script src="http://code.jquery.com/jquery-migrate-1.2.1.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.24/jquery-ui.min.js"></script>
        <script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
        
        <!--<script type="text/javascript" src="http://jqueryui.com/themeroller/themeswitchertool/"></script>-->
        <script type="text/javascript" src="http://maps.google.com/maps/api/js?v=3.8&libraries=geometry&sensor=false"></script>        
        <script type="text/javascript" src="http://www.google.com/jsapi"></script>
<!--        <script type="text/javascript" src="js/markerclusterer_packed.js"></script>-->
        <script type="text/javascript" src="http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerclustererplus/2.1.2/src/markerclusterer_packed.js"></script>
<!--        <script type="text/javascript" src="js/infobox_packed.js"></script>-->
        <script type="text/javascript" src="http://google-maps-utility-library-v3.googlecode.com/svn/tags/infobox/1.1.9/src/infobox_packed.js"></script>
<!--        <script type="text/javascript" src="js/markerwithlabel_packed.js"></script>-->
        <script type="text/javascript" src="http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerwithlabel/1.1.9/src/markerwithlabel_packed.js"></script>
        <script type="text/javascript" src="js/config.js"></script>
        <script type="text/javascript" src="js/table.js"></script>
        <script type="text/javascript" src="js/menu.js"></script>
        <!--<script type="text/javascript" src="js/theme.js"></script>-->
        <script type="text/javascript" src="js/heatmap.js"></script>
        <script type="text/javascript" src="js/constant.js"></script>
        <script type="text/javascript" src="js/newlegend.js"></script>
        <script type="text/javascript" src="js/calendar.js"></script>
        <script type="text/javascript" src="js/common.js"></script>
        <script type="text/javascript" src="js/chart.js"></script>
        <script type="text/javascript" src="js/stat.js"></script>
        <script type="text/javascript" src="js/error.js"></script>
        <script type="text/javascript" src="js/localization.js"></script>
        <script type="text/javascript" src="js/map.js"></script>
        <script type="text/javascript" src="js/general.js"></script>
        <script type="text/javascript" src="js/layer.js"></script>
        <script type="text/javascript" src="js/msg.js"></script>
        <script type="text/javascript" src="js/logging.js"></script>
        <script type="text/javascript" src="js/imageUtil.js"></script>
        <script type="text/javascript" src="js/urlutils.js"></script>
        <script type="text/javascript">
            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-28527203-1']);
            _gaq.push(['_trackPageview']);
            
            (function() {
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();
        </script>
        <script type="text/javascript">
            var sc_project=7349747; 
            var sc_invisible=1; 
            var sc_security="fd05fc3c"; 
        </script>
        <script type="text/javascript" src="http://www.statcounter.com/counter/counter.js"></script>
        <script type="text/javascript">
            $(function() {
                try {
                    //mds.urlutils.checkReferer();
                    var browserInfo = mds.general.checkBrower();
                    if(!browserInfo.ready) {
                        var html = '<img src="img/warning.png"/><br/>';
                        html += '<strong>Attention!</strong><br/>La version de votre navigateur est trop ancienne pour afficher correctement la carte.<br/><br/>'
                            +'<strong>Navigateur</strong>: '+browserInfo.name+'<br/>'
                            +'<strong>Version</strong>: '+browserInfo.version+'<br/><br/>'
                            +'<strong>Recommandation</strong>: <br/>';
                        for(reco in browserInfo.recommandation) {
                            html += 'Télécharger une version supérieur de <a target="_blank" href="'
                                +browserInfo.recommandation[reco]+'">'+reco+'<a/><br/>';
                        }
                        html+='<br/><a href="">Recharger la page</a> une fois la mise à jour effectuée.'
                        $('#browser_support').html(html);
                        
                    } else {
                        $('#page_header').css('display', 'block');
                        <?php
                        error_reporting(0);
                        if (!empty($_GET['map_dbg'])) {
                            echo 'mds.map.DEBUG = true;';
                        }
                        if (!empty($_GET['embedded'])) {
                            echo 'mds.general.embedded=true;';
                        }
                        ?>
                        mds.general.init();
                        setTimeout(function() {
                            <?php
                            try {

                                if (!empty($_GET['year'])) {
                                    $year_ = intval($_GET['year']);
                                    if ($year_ < 2020 && $year_ > 2009) {
                                        $month_str = $_GET['month'];
                                        if (!empty($_GET['month']) || $month_str != null) {
                                            $month_ = intval($_GET['month']);
                                            if ($month_ < 12 && $month_ >= 0) {
                                                echo 'mds.general.loadDate(' . $year_ . ', ' . $month_ . ');';
                                            } else {
                                                echo 'mds.general.loadDate(' . $year_ . ', undefined);';
                                            }
                                        } else {
                                            echo 'mds.general.loadDate(' . $year_ . ', undefined);';
                                        }
                                    } else {
                                        echo 'mds.general.loadDefaultDate();';
                                    }
                                } else if (!empty($_GET['id'])) {
                                    echo 'mds.general.loadId(' . $_GET['id'] . ');';
                                } else {
                                    echo 'mds.general.loadDefaultDate();';
                                }
                                if (!empty($_GET['city'])) {
                                    echo 'mds.general.goToCity("' . $_GET['city'] . '");';
                                }
                                if (!empty($_GET['category'])) {
                                    echo 'mds.general.filterCategory("' . $_GET['category'] . '");';
                                }
                                
                            } catch (Exception $exc) {
                                echo 'mds.general.loadDefaultDate();';
                            }
                            ?>}, 2000);
                        }
                    } catch(e) {
                        alert('Erreur: '+e);
                    }
                });
        </script>
    </head>
    <body style="height: 100%; width: 100%; background: #363636; font-size: 1em">
        <div style="display: none">
            <img src="img/fb_img.png"/>
        </div>
        <div id="fb-root"></div>
        <div id="synoposis" style="display: none">
            Carte interractive de la délinquance, données tirées d'articles de la presse nationale et régionales. Statistiques INSEE, annuaire AMF.
        </div>
        <noscript>
        <div style="background: white; font-size: 2em">
            <img src="img/warning.png"/><br/>
            <strong>Attention! Vous devez activer javascript pour utiliser le site.</strong>
        </div>
        </noscript>
        <div id="browser_support" style="background: white; font-size: 2em"></div>
        <div id="main_bar">
            <div id="music" style="float: right; padding-top: 10px">
                <object type="application/x-shockwave-flash" width="200" height="20" data="dewplayer.swf" id="dewplayer" name="dewplayer">
                    <param name="movie" value="dewplayer.swf" />
                    <param name="flashvars" value="mp3=http://bousculade.free.fr/musique/21%20Douce%20France.mp3&autoplay=true" />
                    <param name="wmode" value="transparent" />
                </object>
            </div>
            <div style="float: left">
                <table>
                    <tr>
                        <!--td style="padding-right: 0px">
                            <div class="fb-like" data-href="http://carte-pdmblog.rhcloud.com" data-send="false" data-layout="button_count" data-width="50" data-show-faces="true"></div>
                        </td-->
<!--                        <td style="padding-right: 10px; padding-top: 3px">
                            <g:plusone size="small" annotation="none" width="30"></g:plusone>
                        </td>-->
<!--                    <td style="padding-right: 5px; padding-top: 5px">
                        <a data-url="http://carte.franceserv.com" href="https://twitter.com/share" data-count="small" class="twitter-share-button" data-lang="fr">Tweet</a>
                    </td>-->
                    <td style="padding-top: 6px">
                        <a href="http://faitsdivers-pdmblog.rhcloud.com" title="faitsdivers-pdmblog" target="_blank">
                            <img src="img/wplogo_small.png" />
                        </a>
                    </td>
                    </tr>
                </table>
            </div>
            <p id="page_header" align="center" style="display: none; color: #EEEEEE; font-size: 2em; margin: 6px">Carte de la délinquance</p>
        </div>
        <div id="menu"></div>
        <div id="localization_dialog"></div>
        <div id="calendar_dialog"></div>
        <div id="stat_dialog"></div>
        <div id="legend_dialog"></div>
        <!--<div id="theme_dialog"></div>-->
        <div id="heatmap_dialog"></div>
        <div id ="load_dialog" style="display: none">
            <div style="margin-top: 20px; margin-left: 20px;">
                <img src="img/vloader.gif" />
            </div>
            <div id="load_dialog_msg"></div>
        </div>
        <div id="credit" style="display: none"></div>
        <div id="about" style="display: none"></div>
        <div id="map"></div>
<!--        <script type="text/javascript">
                window.___gcfg = {lang: 'fr'};

                (function() {
                    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
                    po.src = 'https://apis.google.com/js/plusone.js';
                    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
                })();
        </script>-->
        <script>(function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/fr_FR/all.js#xfbml=1";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        </script>
<!--        <script>
                !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];
                if(!d.getElementById(id)){
                    js=d.createElement(s);
                    js.id=id;js.src="//platform.twitter.com/widgets.js";
                    fjs.parentNode.insertBefore(js,fjs);
                }}(document,"script","twitter-wjs");
        </script>-->
    </body>
</html>
