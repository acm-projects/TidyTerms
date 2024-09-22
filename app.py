# app.py
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello, World!"

@app.errorhandler(404)
def page_not_found(error):
    return "This page does not exist", 404

@app.errorhandler(500)
def internal_server_error(error):
    return "An internal error occurred", 500

if __name__ == '__main__':
    app.run(debug=True)
