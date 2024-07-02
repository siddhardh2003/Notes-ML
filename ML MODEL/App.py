# from transformers import pipeline

# summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# ARTICLE = """ COVID-19, a global pandemic, has transformed societies worldwide. Its impact spans health, economy, and social dynamics. The virus highlighted the importance of public health infrastructure, scientific collaboration, and adaptability. Through resilience and innovation, humanity navigates the challenges posed, emphasizing the necessity of solidarity and proactive measures in combating such crises.
# """
# print(summarizer(ARTICLE, max_length=130, min_length=30, do_sample=False))
# # >>> [{'summary_text': 'Liana Barrientos, 39, is charged with two counts of "offering a false instrument for filing in the first degree" In total, she has been married 10 times, with nine of her marriages occurring between 1999 and 2002. She is believed to still be married to four men.'}]

# from transformers import pipeline
# question_answerer = pipeline("question-answering", model='distilbert-base-cased-distilled-squad')

# context = """
# Extractive Question Answering is the task of extracting an answer from a text given a question. An example     of a
# question answering dataset is the SQuAD dataset, which is entirely based on that task. If you would like to fine-tune
# a model on a SQuAD task, you may leverage the examples/pytorch/question-answering/run_squad.py script."""

# result = question_answerer(question="What is a good example of a question answering dataset?",     context=context)
# print(f"Answer: '{result['answer']}', score: {round(result['score'], 4)}, start: {result['start']}, end: {result['end']}")

from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load models
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
question_answerer = pipeline("question-answering", model='distilbert-base-cased-distilled-squad')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    if 'context' in data and 'question' in data:
        context = data['context']
        question = data['question']
        result = question_answerer(question=question, context=context)
        return jsonify({'answer': result['answer'], 'score': result['score'], 'start': result['start'], 'end': result['end']})
    else:
        return jsonify({'error': 'Invalid input'}), 400

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.json
    if 'text' in data:
        text = data['text']
        summary = summarizer(text, max_length=130, min_length=30, do_sample=False)
        print(summary[0]['summary_text'])
        return jsonify({'summary': summary[0]['summary_text']})
    else:
        return jsonify({'error': 'Invalid input'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)

