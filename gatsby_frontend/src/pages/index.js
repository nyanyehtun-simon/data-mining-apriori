import "./index.css";

import { Col, Container, ListGroup, Row } from "react-bootstrap"

import Layout from "../components/layout"
import React from "react"
import SEO from "../components/seo"
import axios from 'axios';

class IndexPage extends React.Component {
  
  

  constructor(props) {
    super(props);
    this.selectedItemList = []

    // this.itemList = ["Diapers", "Beer", "Eggs", "Milk", "Cola", "Bread"];
    // this.itemUI = this.itemList.map((item, key) => {
    //   return (
    //     <Col key={item}>
    //       <div className="form-checkbox">
    //         <input type="checkbox" className="form-check-input"  value={item} id={item} onClick={this.itemClicked} />
    //         <label className="form-check-label"  htmlFor="customControlAutosizing">{item}</label>
    //       </div>
    //     </Col>
    //   )
    // });
    
    this.state = { 'rhsValue': '', file_upload_text: 'Choose a file...', support_val: '', confidence_val: '', results: '' }
  }

  render() {
    return (
      <Layout pageInfo={{ pageName: "index" }}>
        <SEO title="Home" keywords={[`gatsby`, `react`, `bootstrap`]} />
        <Container className="text-center">
          <Row>
            <Col>
              <form method="post" action="http://localhost:5000/" id="#" encType="multipart/form-data">
                <div className="form-group file-upload-design">
                <label id="upload-button-label" htmlFor="file"><
                  svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg> 
                  <span>{this.state.file_upload_text}</span></label>
                  {/* <label htmlFor="file">Choose a file</label> */}
                  <input type="file" name="file" className="inputfile form-control-file" id="file" onChange={this.onChangeFileUpload} />
                </div>

                <Row>
                  {this.itemUI}
                </Row>
    
                <Row>
                  <Col>
                    <div className="form-group form-input">
                      <label htmlFor="support-value">Support Value:</label>
                      <input type="text" className="form-control" id="support-value-id" placeholder="Enter support value" onChange={(event) => this.formValuesChanged(event, 'support_val')} />
                      <small id="emailHelp" className="form-text text-muted">Support value must be between 0 and 1</small>
                    </div>
                  </Col>
                  <Col>
                    <div className="form-group form-input">
                      <label htmlFor="confidence-value">Confidence Value:</label>
                      <input type="text" className="form-control" id="confidence-value-id" placeholder="Enter confidence value" onChange={(event) => this.formValuesChanged(event, 'confidence_val')} />
                      <small id="emailHelp" className="form-text text-muted">Confidence value must be between 0 and 1</small>
                    </div>
                  </Col>
                </Row>
                
                <Row>
                  <Col>
                    <div className="form-group form-input">
                      <label htmlFor="confidence-value">RHS Value:</label>
                      <input type="text" className="form-control" id="confidence-value-id" placeholder="Enter right hand side value" 
                        value={this.state.rhsValue}
                      />
                      <small id="emailHelp" className="form-text text-muted">Please tick at least one checkbox after uploading csv file.</small>
                    </div>  
                  </Col>
                  <Col>
                    <div className="form-group form-input form-buttons-group">
                      <button type="button" className="btn btn-primary mb-2" onClick={this.executeApriori}>Submit</button>
                      {/* <button type="button" className="btn btn-danger mb-2 reset-btn">Reset</button> */}
                    </div>              
                  </Col>
                </Row>                
    
              </form>

              <Row>
                <Col>
                <div className="form-group form-input">
                  <label htmlFor="exampleFormControlTextarea1">Results</label>
                  <textarea className="form-control" id="exampleFormControlTextarea1" value={this.state.results} readOnly>
                    
                  </textarea>
                </div>
                </Col>
              </Row>
            </Col>
          </Row>
    
        </Container>
      </Layout>
    )
  }

  onChangeFileUpload = (event) => {
    console.log('inside onChangeFileUpload');
    console.log(event.target.files[0]);

    var filename = event.target.files[0].name;
  
    const data = new FormData();
    data.append('file', event.target.files[0]);
  
    axios.post('http://localhost:5000/upload', data, {})
      .then(res => {
        console.log(res);

        this.itemUI = res.data.itemList.map((item, key) => {
          return (
            <Col key={item}>
              <div className="form-checkbox">
                <input type="checkbox" className="form-check-input"  value={item} id={item} onClick={this.itemClicked} />
                <label className="form-check-label"  htmlFor="customControlAutosizing">{item}</label>
              </div>
            </Col>
          
          )
        });

        this.setState({itemUI: this.itemUI, file_upload_text: filename + ' gets uploaded', 'filename': filename})
      })
  }

  itemClicked = (event) => {
    // console.log('itemClicked');
    // console.log(event.target.id);

    if (this.selectedItemList == null) this.selectedItemList = []

    var id = event.target.id
    if (this.selectedItemList.includes(id)) {
      var index = this.selectedItemList.indexOf(id);
      if (index > -1) {
        this.selectedItemList.splice(index, 1);
      }
    } else {
      this.selectedItemList.push(id);
    } 

    // console.log(this.selectedItemList.join(','))
    var itemListText = (this.selectedItemList)? this.selectedItemList.join(','): '';

    this.setState({ 'rhsValue': itemListText });
  }

  formValuesChanged = (event, dataSource) => {
    // console.log(event.target.value);
    // console.log(dataSource);
    var obj = {}
    obj[dataSource] = parseFloat(event.target.value)
    this.setState(obj)
  }

  executeApriori = () => {
    console.log(this.state);

    const data = new FormData();
    data.append('support_val', this.state.support_val);
    data.append('confidence_val', this.state.confidence_val);
    data.append('rhsValue', this.state.rhsValue);
    data.append('filename', this.state.filename)

    axios.post('http://localhost:5000/executeApriori', data, {})
      .then(res => {
          console.log(res)

          // res.data.frequencySetInfo
          var text_area_string = '';
          for (var key in res.data.frequencySetInfo) {
            text_area_string += 'frequent ' + key + '-term set:' + '\n'
            text_area_string += '-'.repeat(30) + '\n'

            res.data.frequencySetInfo[key].forEach((item) => {
              text_area_string += '* [' + item + ']' + '\n'
            })

            text_area_string += '\n'
          }

          text_area_string += 'rules refer to [' + this.state.rhsValue + ']\n'
          text_area_string += '-'.repeat(30) + '\n'

          //  print rules here
          for (var key in res.data.rules) {
              text_area_string += '* [' + res.data.rules[key][0].join(',') + '] -> ['+ this.state.rhsValue +'] | confidence-value: '+ res.data.rules[key][1] + '\n'
          }
          



          console.log('-----------text_area_string------------------')
          console.log(text_area_string)
          this.setState({ 'results': text_area_string })
          
          // Object.keys(res.data.frequencySetInfo).forEach(function(key) {
          //   console.log(key, dictionary[key]);
          // });

          
      })    
  }
  
}



export default IndexPage
