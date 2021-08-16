<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\Request;

class ApiCardController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
            'section_id' => 'required|integer'
        ]);

        try {
            // insert the section record
            $model = Card::create($request->all());
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
        $model =
            Card::findOrFail($id);

        $request->validate([
            'title' => 'required|max:255',
            'section_id' => 'required|integer',
            'description' => 'nullable'
        ]);

        try {
            $model->title = $request->post('title');
            $model->section_id = $request->post('section_id');
            $model->description = $request->post('description');

            $model->save();
        } catch (\Exception $e) {
            // for now throw the exception
            throw $e;
        }

        return $model;
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
            Card::findOrFail($id);

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
