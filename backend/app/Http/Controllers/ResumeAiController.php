<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ResumeAiController extends Controller
{
    private function getGeminiResponse($prompt)
    {
        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) {
            return response()->json(['error' => 'Gemini API key is missing'], 500);
        }

        $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => 0.7,
                'responseMimeType' => 'application/json'
            ]
        ]);

        if ($response->successful()) {
            return json_decode($response->json('candidates.0.content.parts.0.text'), true);
        }

        return response()->json(['error' => 'Failed to generate response from AI', 'details' => $response->body()], 500);
    }

    public function generate(Request $request)
    {
        $request->validate([
            'role' => 'required|string',
            'experience' => 'required|string',
            'skills' => 'required|array'
        ]);

        $role = $request->role;
        $experience = $request->experience;
        $skills = implode(', ', $request->skills);

        $prompt = "You are an expert resume writer. Generate a professional resume summary and 3 bullet points of experience for a {$role} with {$experience} of experience. Their key skills are: {$skills}. Return ONLY a JSON object with two keys: 'summary' (string) and 'experience_bullets' (array of strings).";

        $result = $this->getGeminiResponse($prompt);

        return response()->json($result);
    }

    public function rate(Request $request)
    {
        $request->validate([
            'resume_text' => 'required|string'
        ]);

        $prompt = "You are an expert ATS (Applicant Tracking System) and HR recruiter. Rate the following resume out of 100 based on clarity, impact, and professional wording. Return ONLY a JSON object with two keys: 'score' (number) and 'feedback' (array of 3 actionable improvement strings). Resume: \n\n" . $request->resume_text;

        $result = $this->getGeminiResponse($prompt);

        return response()->json($result);
    }
}
