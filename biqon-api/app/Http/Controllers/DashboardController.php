<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;

class DashboardController extends Controller
{
    public function getDataDashboard(Request $request){
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
        
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

            return DB::connection('mysql2')->table('contactos')
                    ->where('RUT', $rut)
                    ->where('TELEFONO', 'LIKE' ,"%$phone%")
                    ->where('NOMBRE', 'LIKE',  "%$name%")
                    ->where('COMUNA', 'LIKE',  "%$comuna%")
                    ->where('REGION', 'LIKE',  "%$region%")
                    ->get();
        }else if($from != '' && $to != '' && $typeBetween == 'Between' ){
            return DB::connection('mysql2')->table('contactos')
                    ->where('TELEFONO', 'LIKE' ,"%$phone%")
                    ->where('NOMBRE', 'LIKE',  "%$name%")
                    ->where('COMUNA', 'LIKE',  "%$comuna%")
                    ->where('REGION', 'LIKE',  "%$region%")
                    ->whereBetween('RUT', [intval($from), intval($to)])
                    ->get();
        }else if($from != '' && $to != '' && $typeBetween== 'Except' ) {
            return DB::connection('mysql2')->table('contactos')
                    ->where('TELEFONO', 'LIKE' ,"%$phone%")
                    ->where('NOMBRE', 'LIKE',  "%$name%")
                    ->where('COMUNA', 'LIKE',  "%$comuna%")
                    ->where('REGION', 'LIKE',  "%$region%")
                    ->whereNotBetween('RUT', [intval($from), intval($to)])
                    ->get();
        }else if($rutList != ''){
            return DB::connection('mysql2')->table('contactos')
                    ->where('TELEFONO', 'LIKE' ,"%$phone%")
                    ->where('NOMBRE', 'LIKE',  "%$name%")
                    ->where('COMUNA', 'LIKE',  "%$comuna%")
                    ->where('REGION', 'LIKE',  "%$region%")
                    ->whereIn('RUT', $rutList)
                    ->get();
        }else{
            return DB::connection('mysql2')->table('contactos')
                    ->where('TELEFONO', 'LIKE' ,"%$phone%")
                    ->where('NOMBRE', 'LIKE',  "%$name%")
                    ->where('COMUNA', 'LIKE',  "%$comuna%")
                    ->where('REGION', 'LIKE',  "%$region%")
                    ->get();
        }
     
    }
}
