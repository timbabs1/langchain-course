import OpenAI from "openai";
import { writeFileSync, createReadStream } from "fs";

const openai = new OpenAI();

async function createTranscription() {
  const response = await openai.audio.transcriptions.create({
    file: createReadStream("AudioSample.m4a"),
    model: "whisper-1",
    language: "en",
  });
  console.log(response);
}

async function translate() {
  const response = await openai.audio.translations.create({
    file: createReadStream("French_Sample.m4a"),
    model: "whisper-1",
  });
  console.log(response);
}

async function textToSpeech() {
  const response = await openai.audio.speech.create({
    input: "Hello, how are you?",
    voice: "alloy",
    model: "tts-1",
    response_format: "mp3",
  });
  console.log(response);

  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync("hello.mp3", buffer);
}

//createTranscription();
//translate();
textToSpeech();
