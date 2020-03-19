import React, { useState } from 'react';
import { Container, Header, Form as SemanticForm, Message, Grid, Button } from 'semantic-ui-react';
import 'moment/locale/fi';
import moment from 'moment';
import Extras from './Extras';
import createHTML from './Template';
import { validEmail, showInfo } from '../utils';
import BasicDetails from './BasicDetails';

const initialForm = {
  // type: undefined,
  type: 'private',
  from: undefined,
  to: undefined,
  personAmount: 1,
  activeIndex: 0,
  disabledDays: [],
  moreInformation: '',
  cottages: [],
  activities: []
};

const showPrice = false;

const specialDates = [
  { date: 24, month: 12 },
  { date: 31, month: 12 }
];

const Form = ({ fields, sendMail, disabledDays, availableFrom16, availableUntil12 }) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [popupOpen, setPopup] = useState(false);
  const [activePeriod, setActivePeriod] = useState(undefined);

  const getObject = key => fields.find(field => field.key === key);
  const getObjectInList = (key, innerKey) => getObject(key).options.find(option => option.key === innerKey);

  const handleOnChange = (e, data) => {
    setFormData({
      ...formData,
      [data.id]: data.type === 'checkbox' ? data.checked : data.value,
      visitType: data.id === 'visitTypeString' ? undefined : formData.visitType
    });
  };

  const handleCottageChange = (e, data) => {
    const cottages = [...formData.cottages];
    cottages.splice(data.id - 1, 1, data.checked);
    setFormData({ ...formData, cottages });
  };

  const handleOnRadioChange = (e, data, id) => {
    let newFormData = {};
    const values = {
      locationType: undefined,
      meetingType: undefined,
      visitTypeString: ''
    };
    if (id === 'type' && formData.type !== data.value) {
      newFormData = {
        ...values,
        visitType: undefined,
        companyName: ''
      };
      if (data.value === 'private') {
        newFormData = { ...newFormData, departTime: '12', arrivalTime: '16' };
      }
    } else if (id === 'visitType' && formData.visitType !== data.value) {
      newFormData = values;
    }
    setFormData({ ...formData, [id]: data.value, ...newFormData });
    // setErrors();
  };

  const toggleDatePicker = () => {
    setPopup(!popupOpen);
  };
  const cottageOptions = period => {
    return new Array(getObjectInList('extraPersons', 'cottage')[period].choices.length).fill(false);
  };

  const notVilla = formData.locationType !== 'villaParatiisi';

  const handleDayClick = (day, modifiers) => {
    let { to, from } = formData;
    if (!from || notVilla) {
      from = day;
    } else if (!to) {
      to = day;
    }
    if (to && from) {
      // check if we change to or from date when both are already defined
      // new picked date is earlier than from
      if (moment(day).diff(moment(from), 'days') < 0) {
        from = day;
      } else if (moment(from).diff(moment(to), 'days') === 0) {
        from = undefined;
        to = undefined;
      } else {
        to = day;
      }
    }
    // do not change on past days
    if (moment().diff(day, 'days') <= 0) {
      let { arrivalTime, departTime } = formData;
      if (formData.type !== 'company') {
        arrivalTime = '16';
        departTime = '12';
      }
      let { cottages } = formData;
      if (from) {
        const period = [10, 11, 0, 1, 2, 3].includes(from.getMonth()) ? 'winter' : 'summer';
        cottages = activePeriod === period && cottages.length ? cottages : cottageOptions(period);
        setActivePeriod(period);
      }
      setFormData({
        ...formData,
        to,
        from,
        arrivalTime,
        departTime,
        until12Info: modifiers.availableUntil12,
        from16Info: modifiers.availableFrom16,
        cottages
      });
      if (notVilla) {
        toggleDatePicker();
      }
    }
  };

  const calculatePrice = () => {
    // alvPrice
    if (!showPrice) {
      return;
    }
    const priceField = formData.type === 'company' ? 'price' : 'alvPrice';
    let price = 0;
    const { linen, towels, hottub, meetingType, to, from, type, cottages, cleaning, petFee, laavu, recreationType } = formData;

    price = meetingType ? getObjectInList('meetingOptions', formData.meetingType).price : 0;
    price +=
      (linen ? getObject('linen')[priceField] * formData.personAmount : 0) +
      (towels ? getObject('towels')[priceField] * formData.personAmount : 0) +
      (petFee ? getObject('petFee')[priceField] : 0) +
      (laavu ? getObject('laavu')[priceField] : 0) +
      (hottub ? getObject('hottub')[priceField] : 0);
    getObject('rentalEquipment').options.forEach(option => {
      price += formData[option.key] ? option[priceField] || option.alvPrice : 0;
    });
    // let activePeriod = '';
    if (type !== 'company' && (to || from)) {
      let numOfNights = 1;
      if (from && to) {
        numOfNights = moment(to).diff(moment(from), 'days');
      }
      price +=
        numOfNights < 2
          ? getObject('acommodationPrices')[activePeriod]['1']
          : getObject('acommodationPrices')[activePeriod]['1'] +
            (numOfNights - 1) * getObject('acommodationPrices')[activePeriod]['2'];
      const numOfCottages = cottages.filter(Boolean).length;
      price += cleaning
        ? activePeriod === 'summer'
          ? getObject('cleaning').summer
          : getObject('cleaning').winter.villa + getObject('cleaning').winter.cottage * numOfCottages
        : 0;
      getObject('extraPersons').options.forEach(o => {
        if (o.key === 'cottage') {
          price += numOfCottages > 0 && activePeriod !== 'summer' ? o.price * numOfNights * numOfCottages : 0;
        } else {
          price += formData[o.key] ? o.price * numOfNights : 0;
        }
      });
    }
    return price;
  };

  const isValid = () => {
    const date = formData.to || formData.from;
    const mandatoryFields = [
      formData.name,
      formData.email,
      date,
      formData.arrivalTime,
      formData.departTime,
      formData.personAmount,
      formData.type
    ];
    const fieldsFilled = !mandatoryFields.includes('') && !mandatoryFields.includes(undefined);
    const isValidEmail = validEmail(formData.email);
    setErrors({
      mandatoryFields: fieldsFilled ? undefined : 'Täytä pakolliset kentät!',
      isValidEmail: isValidEmail ? undefined : 'Tarkista että sähköposti on oikeassa muodossa!'
    });
    return fieldsFilled && isValidEmail;
  };

  const dateToStr = (from, to) => {
    if (from && to) {
      const diff = moment(to).diff(moment(from), 'days');
      if (formData.type !== 'company') {
        return diff !== 0
          ? `${moment(from).format('DD.MM.YYYY')} - ${moment(to).format('DD.MM.YYYY')}`
          : `${moment(from).format('DD.MM.YYYY')} - ${moment(from)
              .add(1, 'days')
              .format('DD.MM.YYYY')}`;
      }
      return diff !== 0
        ? `${moment(from).format('DD.MM.YYYY')} - ${moment(to).format('DD.MM.YYYY')}`
        : moment(from).format('DD.MM.YYYY');
    } else if (from && !to) {
      if (formData.type !== 'company' && formData.locationType === 'villaParatiisi') {
        return `${moment(from).format('DD.MM.YYYY')} - ${moment(from)
          .add(1, 'days')
          .format('DD.MM.YYYY')}`;
      }
      return moment(from).format('DD.MM.YYYY');
    }
    return '';
  };

  const createDataFields = () => {
    const data = formData;
    const basicInfo = {
      title: getObject('contactDetails').fi,
      [getObject('name').fi]: data.name,
      [getObject('email').fi]: data.email,
      [getObject('phone').fi]: <a href={`tel:${data.phone}`}>{data.phone}</a>,
      [getObject('address').fi]: data.address,
      [getObject('dates').fi]: dateToStr(data.from, data.to),
      [getObject('arrivalTime').fi]: `klo ${data.arrivalTime}`,
      [getObject('departTime').fi]: `klo ${data.departTime}`,
      [getObject('personAmount').fi]: data.personAmount,
      Asiakastyyppi: getObject(data.type).fi
    };
    if (showPrice) {
      basicInfo.Hinta = `${calculatePrice()} €`;
    }
    const extraPersons = { title: 'Lisähenkilöt' };
    const cottages = [];
    const cottage = getObjectInList('extraPersons', 'cottage')[activePeriod];
    data.cottages.forEach((val, i) => {
      if (val) {
        cottages.push(`${cottage.choices[i]} hlön huone`);
      }
    });
    const strCottages = cottages.join(', ');
    extraPersons['Huoneet mökissä'] = !!strCottages && strCottages;

    const priceField = formData.type === 'company' ? 'price' : 'alvPrice';

    const food = { title: 'Tarjoilut' };
    getObject('foodOptions').options.forEach(ac => {
      food[getObjectInList('foodOptions', ac.key).fi] = !!data[ac.key];
    });

    const activities = { title: 'Aktiviteetit ja ohjelmat' };
    activities[data.activities.join(', ')] = true;

    getObject('rentalEquipment').options.forEach(rental => {
      const field = getObjectInList('rentalEquipment', rental.key);
      const price = field[priceField] || field.alvPrice;
      activities[`${field.fi} ${price ? `(${price} €)` : ''}`] = !!data[rental.key];
    });

    const services = ['linen', 'towels', 'hottub', 'cleaning', 'laavu', 'petFee'];
    const extraServices = { title: 'Lisäpalvelut' };
    services.forEach(s => {
      const field = getObject(s);
      const price = field[priceField] || field.alvPrice;
      extraServices[`${field.fi} ${price ? `( ${price} € )` : ''}`] = !!data[s];
    });
    getObject('meetingEquipment').options.forEach(ac => {
      extraServices[getObjectInList('meetingEquipment', ac.key).fi] = !!data[ac.key];
    });

    const visitDetails = { title: 'Vierailun lisätiedot' };
    let visitString;
    if (data.meetingType) {
      const object = getObjectInList('meetingOptions', data.meetingType);
      visitString = `${object.fi} - ${object.duration}h`;
    } else if (data.visitType) {
      visitString = getObject(data.visitType).fi;
    }

    visitDetails['Vierailun tyyppi'] = visitString || data.visitTypeString;
    const { locationType, wainola, haltia } = data;
    visitDetails.Tilat = locationType && getObject(locationType).fi;
    if (locationType === 'wainola' && wainola) {
      visitDetails.Tilat += ` - ${wainola === 'weekDays' ? 'su-to' : 'pe-la'}`;
    } else if (locationType === 'haltia' && haltia) {
      visitDetails.Tilat += ` - ${getObjectInList('haltia', haltia).fi}`;
    }
    visitDetails['Yrityksen nimi'] = data.companyName;
    return {
      basicInfo,
      food,
      extraPersons,
      activities,
      extraServices,
      visitDetails
    };
  };

  const createMail = () => {
    if (isValid()) {
      const strDates = dateToStr(formData.from, formData.to);
      const title = `Tarjouspyyntö ${strDates}`;
      const description = `Tarjouspyyntö ajalle ${strDates} henkilöltä ${formData.name} `;
      const html = createHTML(createDataFields(), title, description, formData.moreInformation);
      sendMail(formData.email, title, html);
    }
    window.scrollTo(0, 0);
  };

  const setType = type => {
    setFormData({ ...formData, type });
  };

  return (
    <div className="main">
      <div className="site-header">
        <h3 className="header-title">Tarjouspyyntö - Nuuksion Taika</h3>
        <p>
          <a href="https://www.nuuksiontaika.fi/">Takaisin Nuuksion Taian sivuille</a>
        </p>
      </div>
      <Container style={{ margin: '40px 0', flexGrow: 1 }}>
        <SemanticForm style={{ margin: '0 5%' }} noValidate="novalidate">
          <Grid columns={4} centered stackable doubling>
            {[
              { text: 'Yritysasiakas', type: 'company' },
              { text: 'Yksityisasiakas', type: 'private' }
            ].map(customer => (
              <Grid.Column>
                <Button size="massive" active={formData.type === customer.type} onClick={() => setType(customer.type)}>
                  {customer.text}
                </Button>
              </Grid.Column>
            ))}
          </Grid>

          {formData.type && (
            <>
              <BasicDetails
                notVilla={notVilla}
                formData={formData}
                popupOpen={popupOpen}
                getObject={getObject}
                getObjectInList={getObjectInList}
                handleDayClick={handleDayClick}
                handleOnChange={handleOnChange}
                toggleDatePicker={toggleDatePicker}
                disabledDays={disabledDays}
                availableUntil12={availableUntil12}
                availableFrom16={availableFrom16}
                dateToStr={dateToStr}
                showInfo={showInfo}
                handleOnRadioChange={handleOnRadioChange}
                handleCottageChange={handleCottageChange}
                activePeriod={activePeriod}
              />
              {Object.values(errors).some(Boolean) && (
                <Message negative>
                  {Object.keys(errors).map(errorKey => errors[errorKey] && <Message.Content>{errors[errorKey]}</Message.Content>)}
                </Message>
              )}
              {formData.from && (
                <>
                  <Extras getObject={getObject} showInfo={showInfo} values={formData} handleOnChange={handleOnChange} />
                  <SemanticForm.TextArea
                    rows={3}
                    autoHeight
                    label="Lisätietoja tarjouspyyntöön"
                    value={formData.moreInformation}
                    id="moreInformation"
                    onChange={handleOnChange}
                  />
                  {showPrice && (
                    <Header as="h4" dividing>
                      Alustava hinta
                    </Header>
                  )}
                  <p>
                    {showPrice && (
                      <>
                        {`Alustava hinta ${
                          formData.type === 'company' ? '(alv 0%)' : ''
                        } sisältäen hinnoitellut palvelut: ${calculatePrice()} €`}
                        <br />
                      </>
                    )}
                    Tarjoilujen ja ohjelmien hinnat määräytyvät saatavuuden mukaan. Pidätämme oikeuden muutoksiin.
                  </p>

                  <Message>
                    <Message.Content>{getObject('paymentInfo')[formData.type].fi}</Message.Content>
                  </Message>

                  <SemanticForm.Button primary content="Lähetä" onClick={createMail} />
                </>
              )}
            </>
          )}
        </SemanticForm>
      </Container>
      <div className="site-header footer">
        <h3 className="header-title">Nuuksion Taika</h3>
        <p>
          050 5050869
          <br />
          <a href="mailto:info@nuuksiontaika.fi">info@nuuksiontaika.fi</a>
        </p>
      </div>
    </div>
  );
};

export default Form;
