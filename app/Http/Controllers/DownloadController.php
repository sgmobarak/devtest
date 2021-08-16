<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class DownloadController extends Controller
{
    public function index(Request $request)
    {
        return abort(404);
    }

    public function getSqlDump(Request $request)
    {
        $defaultCon = config('database.connections.' . config('database.default'), []);
        $filepath = storage_path(sprintf('dump_%s.sql', $defaultCon['database']));

        try {
            \Spatie\DbDumper\Databases\MySql::create()
                ->setDbName($defaultCon['database'])
                ->setUserName($defaultCon['username'])
                ->setPassword($defaultCon['password'])
                ->dumpToFile($filepath);

            // finally return the file as stream
            return Response::download($filepath);
        } catch (\Exception $e) {
            throw $e;
        }

        return abort(404);
    }
}
