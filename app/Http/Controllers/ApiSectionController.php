<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;

class ApiSectionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Section::ofUser(auth()->user())
            //->latest()
            ->with(['cards'])
            ->paginate();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|max:255',
        ]);

        try {
            // insert the section record
            $model = Section::create($request->all());
        } catch (\Exception $e) {
            // for now throw the exception
            throw $e;
        }

        return $model;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $model =
            Section::ofUser(auth()->user())
            ->findOrFail($id);

        try {
            // delete from the database
            $model->delete();
        } catch (\Exception $e) {
            // for now throw the exception
            throw $e;
        }

        return null;
    }
}
