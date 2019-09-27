import os
#import magic
import urllib.request
from flask import Flask, flash, request, redirect, render_template
from werkzeug.utils import secure_filename
import csv
import json
from flask_cors import CORS
import sys
sys.path.append('./algorithm_data')

from apriori import Apriori

ALLOWED_EXTENSIONS = set(['csv'])

UPLOAD_FOLDER = '.'

app = Flask(__name__)
CORS(app)
# app.secret_key = "secret key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

current_file_name = ''

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            print('No file part')
            return json.dumps({ 'status': 'No file part' })
            
        file = request.files['file']
        if file.filename == '':
            print('No file selected for uploading')
            
            return json.dumps({ 'status': 'No file selected for uploading' })
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            current_file_name = filename
            # print('----current_file_name------')
            # print(current_file_name)
            itemListSet=set([])

            with open(os.path.join(app.config['UPLOAD_FOLDER'], filename), 'r') as file:
                reader = csv.reader(file, delimiter=',')
                for line in reader:
                    for item in line:
                        itemListSet.add(item)
            
            print('File successfully uploaded')
            json_string = json.dumps({ 'itemList': list(itemListSet) })

            print(json_string)

            return json_string

        else:
            print('Allowed file type is csv')
            return redirect(request.url)

@app.route('/executeApriori', methods=['POST'])
def execute_apriori():
    if request.method == 'POST':
        # print(request.form.get('support_val'))
        # print(request.form.get('confidence_val'))
        # print(request.form.get('rhsValue'))
        # print(request.form.get('filename'))

        minSupp = float(request.form.get('support_val'))
        minConf = float(request.form.get('confidence_val'))
        rhsValue = request.form.get('rhsValue')
        filename = request.form.get('filename')

        filePath = './' + filename
        # Run Apriori algorithm here and respond back the rules
        return_obj = dict()

        # Come up with the reaponse data type to wrap all data to respond
        if rhsValue != None and ',' in rhsValue:
            rhs_list = [opt.strip() for opt in rhsValue.split(',')]
            rhs      = frozenset(rhs_list)

            print(rhs)    
        elif rhsValue != None:
            rhs      = frozenset([rhsValue])
        else:
            rhs      = frozenset([])
        
        print("""Parameters: \n - filePath: {} \n - mininum support: {} \n - mininum confidence: {} \n - rhs: {}\n""".\
            format(filePath,minSupp,minConf, rhs))

        # Run and print
        objApriori = Apriori(minSupp, minConf)
        # freqSet is actually dictionary
        itemCountDict, freqSet = objApriori.executeApriori(filePath)

        # print('------itemCountDict-------')
        # print(itemCountDict)
        # print('-------freqSet-----------')
        # print(freqSet)
        frequencyObj = {}

        for key, value in freqSet.items():
            temp = []
            print('frequent {}-term set:'.format(key))
            print('-'*20)
            for itemset in value:
                print(list(itemset))
                temp.append(list(itemset))
            frequencyObj[key] = temp

        return_obj['frequencySetInfo'] = frequencyObj

        # Return rules with regard of `rhs`
        rules = objApriori.getSpecRules(rhs)
        print('-'*20)
        print('rules refer to {}'.format(list(rhs)))

        rulesObj = {}
        count = 1
        for key, value in rules.items():
            rulesObj[count] = [ list(key), value ]
            print('{} -> {}: {}'.format(list(key), list(rhs), value))

            count += 1

        return_obj['rules'] = rulesObj

        print(return_obj);

        return_string = json.dumps(return_obj)

        return return_string

if __name__ == "__main__":
    app.run()