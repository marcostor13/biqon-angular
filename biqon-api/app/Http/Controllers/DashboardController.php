<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;

class DashboardController extends Controller
{

    public $production = false; 

    public function __construct(){
        if($_SERVER['HTTP_HOST'] == 'binteraction.cl' || $_SERVER['HTTP_HOST'] == '35.238.14.128') $this->production = true;
    }

    public function getDataDashboard(Request $request){

        $database = ($this->production) ? 'mysql' : 'mysql2'; 
        
        if ($request->data['name'] == '' && $request->data['phone'] == '' && $request->data['comuna'] == '' && $request->data['region'] == '' && $request->data['rut'] == '' && $request->data['rutList'] == '' && $request->data['from'] == '' && $request->data['to'] == ''){            
            return false;        
        }

        $rut = $request->data['rut'];
        $phone = $request->data['phone'];
        $name = strtoupper($request->data['name']);
        $comuna = strtoupper($request->data['comuna']);
        $region = strtoupper($request->data['region']);
        if($request->data['rutList'] && $request->data['rutList'] != ''){
            $rutList =  explode("\n", $request->data['rutList']);
        }else{
            $rutList = '';
        }
        $from = $request->data['from']; 
        $to = $request->data['to']; 
        $typeBetween = $request->data['Between'];


        if($rut != ''){

            return DB::connection($database)->table('contactos')
                    ->where('RUT', $rut)
                    ->where('TELEFONO', 'LIKE' ,"%$phone%")
                    ->where('NOMBRE', 'LIKE',  "%$name%")
                    ->where('COMUNA', 'LIKE',  "%$comuna%")
                    ->where('REGION', 'LIKE',  "%$region%")
                    ->get();
        }else if($from != '' && $to != '' && $typeBetween == 'Between' ){
            return DB::connection($database)->table('contactos')
                    ->where('TELEFONO', 'LIKE' ,"%$phone%")
                    ->where('NOMBRE', 'LIKE',  "%$name%")
                    ->where('COMUNA', 'LIKE',  "%$comuna%")
                    ->where('REGION', 'LIKE',  "%$region%")
                    ->whereBetween('RUT', [intval($from), intval($to)])
                    ->get();
        }else if($from != '' && $to != '' && $typeBetween== 'Except' ) {
            return DB::connection($database)->table('contactos')
                    ->where('TELEFONO', 'LIKE' ,"%$phone%")
                    ->where('NOMBRE', 'LIKE',  "%$name%")
                    ->where('COMUNA', 'LIKE',  "%$comuna%")
                    ->where('REGION', 'LIKE',  "%$region%")
                    ->whereNotBetween('RUT', [intval($from), intval($to)])
                    ->get();
        }else if($rutList != ''){
            return DB::connection($database)->table('contactos')
                    ->where('TELEFONO', 'LIKE' ,"%$phone%")
                    ->where('NOMBRE', 'LIKE',  "%$name%")
                    ->where('COMUNA', 'LIKE',  "%$comuna%")
                    ->where('REGION', 'LIKE',  "%$region%")
                    ->whereIn('RUT', $rutList)
                    ->get();
        }else{
            return DB::connection($database)->table('contactos')
                    ->where('TELEFONO', 'LIKE' ,"%$phone%")
                    ->where('NOMBRE', 'LIKE',  "%$name%")
                    ->where('COMUNA', 'LIKE',  "%$comuna%")
                    ->where('REGION', 'LIKE',  "%$region%")
                    ->get();
        }
     
    }

    public function getLetters(){
        return ['A','B','C','D','E','F','G','H','I'];  //aumentar si es necesario
    }


    public function uploadData(Request $request){

        $database = ($this->production) ? 'mysql' : 'mysql2'; 

        $letters = $this->getLetters(); 
        $data = [];

        foreach ($request->data as $r) {

            if($r[0] == '!ref') continue;
            if($r[0] == '!margins') continue;
            $data[$r[0]] = $r[1]['w'];          
        }

        //GET HEADERS

        $headers = [];
        $dataRes = [];
        $dataResTotal = [];



        for ($i=0; $i < count($data); $i++) { 
            if(array_key_exists($i, $letters) && $data[$letters[$i].'1']){
                $headers[] = $data[$letters[$i].'1']; 
            }else{
                break;
            }
        }

        $x = 2; 
        $c = 0; 

        for ($i=0; $i < count($data); $i++) { 
            if(array_key_exists($c, $letters) && array_key_exists($letters[$c].$x, $data)){     
                if($headers[$c] == 'FECHA'){
                    $date = date_create($data[$letters[$c].$x]);                    
                    $dataRes[$headers[$c]] = date_format($date, 'Y-m-d'); 
                }else{
                    $dataRes[$headers[$c]] = $data[$letters[$c].$x]; 
                }          
                $c++;
            }else{

                if(count($dataRes) > 0){
                    $dataResTotal[] = $dataRes;
                    $dataRes = [];
                    $x++;
                    $c = 0; 
                }

            }
        }    
        
        // return $dataResTotal;

        DB::connection($database)->table('contactos')->insert($dataResTotal);

        return ['status' => true];


    }


}
