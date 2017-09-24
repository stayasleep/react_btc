<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST,GET,OPTIONS');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$contents =file_get_contents("php://input");
$contents = utf8_encode($contents);
$contents = json_decode($contents, true);


$url = $contents['url'];
$periods = $contents['periods'];

$url = $url ."?periods=" . $periods;
$gdax ="https://api.gdax.com/products/ETH-USD/candles?start=1504228961";
//var_dump($url);


//GDAX requires user agent to be set, so we will randomly send a diff one each time
$agents = array(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:7.0.1) Gecko/20100101 Firefox/7.0.1',
    'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.1.9) Gecko/20100508 SeaMonkey/2.0.4',
    'Mozilla/5.0 (Windows; U; MSIE 7.0; Windows NT 6.0; en-US)',
    'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_7; da-dk) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1'

);
//get curl resource
$ch = curl_init();

curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json', 'Content-Type: application/json'));
curl_setopt($ch,CURLOPT_USERAGENT,$agents[array_rand($agents)]);
curl_setopt($ch, CURLOPT_URL, $url);

$data = curl_exec($ch);

//free up resources
curl_close($ch);
$data = json_encode($data);
//var_dump($data);
print_r($data);
?>