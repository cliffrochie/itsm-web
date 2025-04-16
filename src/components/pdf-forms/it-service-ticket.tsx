import { Document, Page, PDFViewer, Text, View, Image, Font } from "@react-pdf/renderer";
import { styles } from "@/components/pdf-forms/styles";
import NIALogo from '@/assets/images/2020-nia-logo.png'
import BagongPilipinasLogo from '@/assets/images/bagong-pilipinas.png'
import OPLogo from '@/assets/images/office-of-the-president.png'
import NoStar from '@/assets/images/rating-0-star.png'
import OneStar from '@/assets/images/rating-1-star.png'
import TwoStar from '@/assets/images/rating-2-star.png'
import ThreeStar from '@/assets/images/rating-3-star.png'
import FourStar from '@/assets/images/rating-4-star.png'
import FiveStar from '@/assets/images/rating-5-star.png'
import IsoCertification from '@/assets/images/iso-certification.jpg'
import NiaBrandingFooter from '@/assets/images/nia-branding-footer.png'
import NIAFooter from '@/assets/images/nia-footer.png'
import * as PDFTable from "@propra/react-pdf-table"
import TrajanProBold from '@/assets/fonts/TrajanPro-Bold.otf'
import TrajanPro from '@/assets/fonts/TrajanPro.otf'
import Cambria from '@/assets/fonts/Cambria.ttf'
import CambriaBold from '@/assets/fonts/Cambria-Bold.ttf'
import CambriaItalic from '@/assets/fonts/Cambria-Italic.ttf'

Font.register({
  family: 'Trajan-Pro-Bold',
  src: TrajanProBold
})

Font.register({
  family: 'Trajan-Pro',
  src: TrajanPro
})

Font.register({
  family: 'Cambria-Bold',
  src: CambriaBold
})


Font.register({
  family: 'Cambria-Italic',
  src: CambriaItalic
})


Font.register({
  family: 'Cambria',
  src: Cambria
})


export default function Invoice() {
  const title = 'Can\'t print to the printer'
  const description = 'It says the printer end of its life service, blinking red LED.'


  const ITServiceTicketPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={{flexDirection: 'row', gap: '2px'}}>
            <Image src={OPLogo} style={{ width: '50px', height: '50px'}} />
            <Image src={NIALogo} style={{ width: '50px', height: '50px'}} />
            <View style={{ justifyContent: 'center', marginLeft: '8px', gap: '1px'}}>
              <Text style={{fontSize: '10px', fontWeight: 'bold', fontFamily: 'Times-Bold', marginBottom: '2.5px'}}>Republic of the Philippines</Text>
              <Text style={{fontSize: '10.5px', fontWeight: 'bold', fontFamily: 'Trajan-Pro-Bold'}}>NATIONAL IRRIGATION ADMINISTRATION</Text>
              <Text style={{fontSize: '9px', fontFamily: 'Trajan-Pro'}}>REGIONAL OFFICE NO. XIII (CARAGA)</Text>
            </View>
          </View>
          <Image src={BagongPilipinasLogo} style={{width: '50px', height: '50px'}} />
        </View>

        <View style={{alignItems: 'center', marginBottom: '13px'}}>
          <Text style={{...styles.fontCambriaBold, fontSize: '12px'}}>IT SERVICE TICKET</Text>
        </View>

        <View style={{flexDirection: 'row',}}>
          <View style={{width: '250px'}}>
            <View style={{flexDirection: 'row' }}>
              <Text style={{...styles.fontCambria, marginRight: '8px'}}>ITST No.:</Text>
              <Text style={styles.fontCambria}>PS-250307-001</Text>
            </View>
          </View>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{...styles.fontCambria, marginRight: '8px'}}>Client Name:</Text>
              <Text style={{...styles.fontCambria, }}>Alberto P. Katigbak</Text>
            </View>
          </View>
        </View>
        <View style={{...styles.line, marginBottom: '4px'}}></View>

        <View style={{flexDirection: 'row',}}>
          <View style={{width: '250px'}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{...styles.fontCambria, marginRight: '8px'}}>Date:</Text>
              <Text style={styles.fontCambria}>03/07/2025</Text>
            </View>
          </View>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{...styles.fontCambria, marginRight: '8px'}}>Designation:</Text>
              <Text style={{...styles.fontCambria, }}>Sr. Computer Technician</Text>
            </View>
          </View>
        </View>
        <View style={{...styles.line, marginBottom: '4px'}}></View>

        <View style={{flexDirection: 'row',}}>
          <View style={{width: '250px'}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{...styles.fontCambria, marginRight: '8px'}}>Time:</Text>
              <Text style={styles.fontCambria}>10:30 AM</Text>
            </View>
          </View>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{...styles.fontCambria, marginRight: '8px'}}>Division/Department:</Text>
              <Text style={{...styles.fontCambria, }}>RM's Office</Text>
            </View>
          </View>
        </View>
        <View style={{...styles.line, borderBottomWidth: 1, marginBottom: '4px'}}></View>


        <View style={{marginBottom: '4px'}}>
          <Text style={styles.fontCambriaBold}>Nature of Work:</Text>
        </View>

        <View>
          <Text style={{...styles.fontCambria}}>Task/Problem reported:&nbsp;&nbsp;&nbsp;{title}</Text>
        </View>
        <View style={{...styles.line, marginBottom: '4px',}}>
          {/* <Text style={{...styles.fontCambria}}>Hello World</Text> */}
        </View>
        <View style={{...styles.line, marginBottom: '20px',}}>
          <Text style={{...styles.fontCambria}}>- {description}</Text>
        </View>

        <View style={{...styles.line, borderBottomWidth: 1, marginBottom: '4px'}}>
          <Text style={{...styles.fontCambria}}></Text>
        </View>

        <View style={{marginBottom: '4px'}}>
          <Text style={styles.fontCambriaBold}>Equipment/Device Details:</Text>
        </View>

        <View style={{flexDirection: 'row',}}>
          <View style={{width: '250px'}}>
            <View style={{flexDirection: 'row' }}>
              <Text style={{...styles.fontCambria, marginRight: '8px'}}>Serial No.:</Text>
              <Text style={styles.fontCambria}>DCEGTV295000034</Text>
            </View>
          </View>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{...styles.fontCambria, marginRight: '8px'}}>Equipment Type:</Text>
              <Text style={{...styles.fontCambria, }}>Computer</Text>
            </View>
          </View>
        </View>
        <View style={{...styles.line, marginBottom: '4px'}}></View>

        <View style={{marginBottom: '4px'}}>
          <Text style={styles.fontCambriaBold}>Service Details:</Text>
        </View>

        <View style={{flexDirection: 'row',}}>
          <View style={{width: 'auto',}}>
            <View style={{flexDirection: 'row' }}>
              <Text style={{...styles.fontCambria, marginRight: '8px'}}>Defects found on Inspection:</Text>
              <Text style={styles.fontCambria}>Ink waste pad counter reached its threshold.</Text>
            </View>
          </View>
        </View>
        <View style={{...styles.line, marginBottom: '4px'}}></View>

        <View style={{flexDirection: 'row',}}>
          <View style={{width: 'auto'}}>
            <View style={{flexDirection: 'row' }}>
              <Text style={{...styles.fontCambria, marginRight: '8px'}}>Service Rendered:</Text>
              <Text style={styles.fontCambria}>Reset ink waste pad counter.</Text>
            </View>
          </View>
        </View>
        <View style={{...styles.line, marginBottom: '4px'}}></View>

        <View style={{flexDirection: 'row',}}>
          <View style={{width: 'auto'}}>
            <View style={{flexDirection: 'row' }}>
              <Text style={{...styles.fontCambria, marginRight: '8px'}}>Service Engineer's Remarks:</Text>
              <Text style={styles.fontCambria}></Text>
            </View>
          </View>
        </View>
        <View style={{...styles.line, marginBottom: '18px'}}></View>

        <View style={{flexDirection: 'row', gap: '2px'}}>
          <View style={{width: 'auto'}}>
            <View style={{flexDirection: 'column' }}>
              <Text style={{...styles.fontCambria, marginRight: '8px'}}>Service Engineer</Text>
              <View style={{marginTop: '5px',}}>
                <View style={{flexDirection: 'column', width: '250px',}}>
                  <View style={{flexDirection: 'row', width: 'auto'}}>
                    <Text style={{...styles.fontCambria, marginRight: '5px'}}>Name & Signature:</Text>
                    <View style={{flexDirection: 'row', width: '133.5px', justifyContent: 'center'}}>
                      <Text style={{...styles.fontCambria,}}>Angelito S. Pajarillo</Text>
                    </View>
                  </View>
                  <Text style={{...styles.line, width: '132.5px', marginLeft: '85px'}}></Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{width: 'auto'}}>
            <View style={{flexDirection: 'column' }}>
              <Text style={{...styles.fontCambria, marginRight: '8px'}}>Acknowledgement</Text>
              <View style={{marginTop: '5px',}}>
                <View style={{flexDirection: 'column', width: '250px',}}>
                  <View style={{flexDirection: 'row', width: 'auto'}}>
                    <Text style={{...styles.fontCambria, marginRight: '8px'}}>Signature:</Text>
                    <View style={{flexDirection: 'row', width: '186px', justifyContent: 'center',}}>
                      <Text style={{...styles.fontCambria,}}>Alberto P. Katigbak</Text>
                    </View>
                  </View>
                  <Text style={{...styles.line, width: '184.5px', marginLeft: '60.5px'}}></Text>
                </View>
              </View>
            </View>
          </View> 
        </View>

        <View style={{...styles.line, borderBottomWidth: 1, marginTop: '15px', marginBottom: '4px'}}>
          <Text style={{...styles.fontCambria}}></Text>
        </View>

        <View style={{marginBottom: '4px'}}>
          <Text style={styles.fontCambriaBold}>Performance Rating & Feedback:</Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center', gap: '3px'}}>
          <Text style={styles.fontCambria}>Performance Rating:</Text>
          <Image src={TwoStar} style={{width: '80px'}} />
        </View>
        <View style={{...styles.line, marginBottom: '4px'}}></View>

        <View style={{flexDirection: 'row'}}>
          <Text style={{...styles.fontCambria, marginRight: '8px'}}>Feedback:</Text>
          <Text style={{...styles.fontCambria}}>Solved the problem quickly.</Text>
        </View>
        <View style={{...styles.line, marginBottom: '4px'}}></View>

        <View style={{...styles.line, borderBottomWidth: 1, marginTop: '15px', marginBottom: '4px'}}>
          <Text style={{...styles.fontCambria}}></Text>
        </View>

        <View style={{marginBottom: '4px'}}>
          <Text style={styles.fontCambriaBold}>Rating Interpretation:</Text>
        </View>

        <View style={{...styles.fontCambria}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: '90px', alignItems: 'center', border: '1px solid grey', margin: '-1px', padding: '3px'}}>
              <Image src={NoStar} style={{width: '55px'}} />
            </View>
            <View style={{width: '100%', border: '1px solid grey', margin: '0px', padding: '4px'}}>
              <Text style={{width: '100%', paddingLeft: '5px'}}>No rating provided.</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: '-1px'}}>
            <View style={{width: '90px', alignItems: 'center', border: '1px solid grey', margin: '-1px', padding: '3px'}}>
              <Image src={OneStar} style={{width: '55px'}} />
            </View>
            <View style={{width: '100%', border: '1px solid grey', margin: '0px', padding: '4px'}}>
              <Text style={{width: '100%', paddingLeft: '5px'}}>Interpreted as very dissatisfactory.</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: '-1px'}}>
            <View style={{width: '90px', alignItems: 'center', border: '1px solid grey', margin: '-1px', padding: '3px'}}>
              <Image src={TwoStar} style={{width: '55px'}} />
            </View>
            <View style={{width: '100%', border: '1px solid grey', margin: '0px', padding: '4px'}}>
              <Text style={{width: '100%', paddingLeft: '5px'}}>Interpreted as dissatisfactory.</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: '-1px'}}>
            <View style={{width: '90px', alignItems: 'center', border: '1px solid grey', margin: '-1px', padding: '3px'}}>
              <Image src={ThreeStar} style={{width: '55px'}} />
            </View>
            <View style={{width: '100%', border: '1px solid grey', margin: '0px', padding: '4px'}}>
              <Text style={{width: '100%', paddingLeft: '5px'}}>Interpreted as neutral.</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: '-1px'}}>
            <View style={{width: '90px', alignItems: 'center', border: '1px solid grey', margin: '-1px', padding: '3px'}}>
              <Image src={FourStar} style={{width: '55px'}} />
            </View>
            <View style={{width: '100%', border: '1px solid grey', margin: '0px', padding: '4px'}}>
              <Text style={{width: '100%', paddingLeft: '5px'}}>Interpreted as satisfactory.</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: '-1px'}}>
            <View style={{width: '90px', alignItems: 'center', border: '1px solid grey', margin: '-1px', padding: '3px'}}>
              <Image src={FiveStar} style={{width: '55px'}} />
            </View>
            <View style={{width: '100%', border: '1px solid grey', margin: '0px', padding: '4px'}}>
              <Text style={{width: '100%', paddingLeft: '5px'}}>Interpreted as very satisfactory.</Text>
            </View>
          </View>
        </View>

        <View style={{...styles.fontCambriaItalic, marginTop: '5px', fontSize: '9px', flexDirection: 'row', gap: '3px'}}>
          <Text>Note:</Text>          
          <Text>This form and its data is system generated.</Text>
        </View>


        <View style={{
          marginTop: '70px', 
          position: 'absolute', 
          padding: '0 10px',
          bottom: 20,
          left: 0,
          right: 0,
        }}>
          <Image src={NIAFooter} style={{position: 'absolute', padding: '0 10px', bottom: -15, left: 0, width: '100%', zIndex: 0}} />
        </View>

      </Page>
    </Document>
  );


  return (
    <div className="w-full h-screen">
      <PDFViewer width="100%" height="100%">
        <ITServiceTicketPDF/>
      </PDFViewer>
    </div>
  )
}