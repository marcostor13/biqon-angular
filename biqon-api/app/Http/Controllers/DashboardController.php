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
}
