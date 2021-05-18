import React, { useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Container, Header, Form as SemanticForm, Message, Grid, Button } from 'semantic-ui-react';
import 'moment/locale/fi';
import moment from 'moment';
import Extras from './Extras';
import createHTML from './Template';
import { validEmail, showInfo, reserveRightsToChanges } from '../utils';
import BasicDetails from './BasicDetails';

export const WainolaKeys = [
  { name: 'Sunnuntai-perjantai', key: 'weekDays' },
  { name: 'Lauantai', key: 'weekend' },
];

export const villaAcommodationTypes = {
  villaParatiisiFullWeekend: 'Pe-su (2 vrk)',
  villaParatiisiWeekend: 'Pe-la / la-su (1 vrk)',
  villaParatiisi: 'Su-pe',
};

const initialForm = {
  from: undefined,
  to: undefined,
  personAmount: 1,
  activeIndex: 0,
  disabledDays: [],
  moreInformation: '',
  cottages: [],
  activities: [],
  cottagesAmount: 0,
  locationType: undefined,
};

const showPrice = false;
const showAcommodationPrice = false;

const Form = ({ fields, sendMail, disabledDays, availableFrom16, availableUntil12, customerType }) => {
  const [formData, setFormData] = useState({ ...initialForm, type: customerType });
  const [errors, setErrors] = useState({});
  const [popupOpen, setPopup] = useState(false);
  const [activePeriod, setActivePeriod] = useState(undefined);

  const getObject = (key) => fields.find((field) => field.key === key);
  const getObjectInList = (key, innerKey) => getObject(key).options.find((option) => option.key === innerKey);

  const handleOnChange = (e, data) => {
    setFormData({
      ...formData,
      [data.id]: data.type === 'checkbox' ? data.checked : data.value,
      visitType: data.id === 'visitTypeString' ? undefined : formData.visitType,
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
      visitTypeString: '',
    };
    if (id === 'type' && formData.type !== data.value) {
      newFormData = {
        ...values,
        visitType: undefined,
        companyName: '',
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
  const cottageOptions = (period) => {
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
        cottages,
      });
      if (notVilla) {
        toggleDatePicker();
      }
    }
  };

  const numOfNights = formData.from && formData.to ? moment(formData.to).diff(moment(formData.from), 'days') : 1;

  const showWeekendPrices = () => {
    let onlyWeekend = false;
    let alsoWeekend = false;
    const start = Number(moment(formData.from).format('d'));
    const end = formData.to ? Number(moment(formData.to).format('d')) : start;
    // reservation starts on friday or saturday
    if (numOfNights === 1 && [5, 6].includes(start)) {
      onlyWeekend = true;
      // reservation is over weekend from friday to sunday
    } else if (numOfNights === 2 && start === 5 && end === 0) {
      onlyWeekend = true;
    } else if (numOfNights >= 2) {
      const endDay = start + numOfNights;
      alsoWeekend = endDay >= 6;
    }
    return { onlyWeekend, alsoWeekend };
  };

  const privatePersonAcommodationPrice = () => {
    if (formData.villaParatiisi) {
      const acPrices = getObject('acommodationPrices')[activePeriod];
      const extraPersons = getObjectInList('extraPersons', 'cottage')[activePeriod];
      let villaPrice = acPrices['1'];
      villaPrice += numOfNights > 1 && (numOfNights - 1) * acPrices['2'];
      const { cottagesAmount } = formData;
      let cottagesPrices = 0;
      let cottageFirstNight = null;
      let cottageNextNights = null;
      if (cottagesAmount) {
        cottagesPrices = numOfNights === 1 ? extraPersons['1'] : extraPersons['1'] + (numOfNights - 1) * extraPersons['2'];
        cottageFirstNight = `Ensimmäinen vuorokausi ${cottagesAmount * extraPersons['1']} € / ${cottagesAmount} huonetta`;
        cottageNextNights =
          numOfNights > 1
            ? `Lisävuorokaudet ${(numOfNights - 1) * cottagesAmount * extraPersons['2']} € / ${cottagesAmount} huonetta / ${
                numOfNights - 1
              } yötä`
            : null;
      }
      const acTitle = `Majoitus ${numOfNights} vuorokautta`;
      const villaFirstNight = `Ensimmäinen vuorokausi ${acPrices['1']} €`;
      const villaNextNights =
        numOfNights > 1 ? `Lisävuorokaudet ${(numOfNights - 1) * acPrices['2']} € / ${numOfNights - 1} yötä` : null;

      return {
        villaPrice,
        cottagesPrices: cottagesPrices * cottagesAmount,
        acTitle,
        villaFirstNight,
        villaNextNights,
        cottageFirstNight,
        cottageNextNights,
      };
    }
    return {};
  };

  const calculatePrice = () => {
    // alvPrice
    if (!showPrice) {
      return;
    }
    const priceField = formData.type === 'company' ? 'price' : 'alvPrice';
    let price = 0;
    const { linen, towels, hottub, meetingType, to, from, type, cottages, cleaning, petFee } = formData;

    price = meetingType ? getObjectInList('meetingOptions', formData.meetingType).price : 0;
    price +=
      (linen ? getObject('linen')[priceField] * formData.personAmount : 0) +
      (towels ? getObject('towels')[priceField] * formData.personAmount : 0) +
      (petFee ? getObject('petFee')[priceField] : 0) +
      (hottub ? getObject('hottub')[priceField] : 0);
    getObject('rentalEquipment').options.forEach((option) => {
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
      getObject('extraPersons').options.forEach((o) => {
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
      formData.type,
    ];
    const fieldsFilled = !mandatoryFields.includes('') && !mandatoryFields.includes(undefined);
    const isValidEmail = validEmail(formData.email);
    setErrors({
      mandatoryFields: fieldsFilled ? undefined : 'Täytä pakolliset kentät!',
      isValidEmail: isValidEmail ? undefined : 'Tarkista että sähköposti on oikeassa muodossa!',
    });
    return fieldsFilled && isValidEmail;
  };

  const dateToStr = (from, to) => {
    if (from) {
      const diff = to ? moment(to).diff(moment(from), 'days') : undefined;
      return diff
        ? `${moment(from).format('DD.MM.YYYY')} - ${moment(to).format('DD.MM.YYYY')}`
        : moment(from).format('DD.MM.YYYY');
    }
    return '';
  };

  const createDataFields = () => {
    const data = formData;
    const basicInfo = {
      title: getObject('contactDetails').fi,
      Asiakastyyppi: getObject(data.type).fi,
      [getObject('name').fi]: data.name,
      [getObject('email').fi]: data.email,
      [getObject('phone').fi]: <a href={`tel:${data.phone}`}>{data.phone}</a>,
      [getObject('address').fi]: data.address,
      [getObject('dates').fi]: dateToStr(data.from, data.to),
      [getObject('arrivalTime').fi]: `klo ${data.arrivalTime}`,
      [getObject('departTime').fi]: `klo ${data.departTime}`,
      [getObject('personAmount').fi]: data.personAmount,
    };
    if (showPrice) {
      basicInfo.Hinta = `${calculatePrice()} €`;
    }
    const isCompany = formData.type === 'company';
    const priceField = isCompany ? 'price' : 'alvPrice';

    const food = {
      Tarjoilut: getObject('foodOptions')
        .options.filter((f) => data[f.key])
        .map((f) => f.fi)
        .join(', '),
    };
    const activities = { 'Aktiviteetit ja ohjelmat': data.activities.join(', ') };
    const rentalEquipment = {
      Vuokravälineet: getObject('rentalEquipment')
        .options.filter((eq) => data[eq.key])
        .map((eq) => {
          const field = getObjectInList('rentalEquipment', eq.key);
          const price = field[priceField] || field.alvPrice;
          return `${field.fi} ${price ? `(${price} €)` : ''}`;
        }),
    };

    const services = ['linen', 'towels', 'hottub', 'cleaning', 'petFee'];
    const selectedServices = services
      .filter((service) => data[service])
      .map((s) => {
        const field = getObject(s);
        const price = field[priceField] || field.alvPrice;
        return `${field.fi} ${price ? `( ${price} € )` : ''}`;
      });
    const allServices = selectedServices.concat(
      getObject('meetingEquipment')
        .options.filter((eq) => data[eq.key])
        .map((eq) => getObjectInList('meetingEquipment', eq.key).fi)
    );
    const extraServices = { Lisäpalvelut: allServices };

    const visitDetails = { title: 'Vierailun lisätiedot' };
    let visitString;
    const {
      locationType,
      wainola,
      haltia,
      cottagesAmount,
      villaParatiisi,
      villaParatiisiFullWeekend,
      villaParatiisiWeekend,
      ilmanTiloja,
    } = data;
    if (data.meetingType && locationType === 'villaParatiisi') {
      const object = getObjectInList('meetingOptions', data.meetingType);
      visitString = `${object.fi} - ${object.duration}h - ${object.price} € + alv`;
    } else if (data.visitType) {
      visitString = getObject(data.visitType).fi;
    }

    visitDetails['Vierailun tyyppi'] = visitString || data.visitTypeString;
    visitDetails.Tilat = locationType && getObject(locationType).fi;
    if (locationType === 'wainola' && wainola) {
      const dayType = wainola.includes(WainolaKeys[0].key) ? WainolaKeys[0] : WainolaKeys[1];
      const wainolaObj = getObject('wainola')[dayType.key].find((o) => o.key === wainola);
      visitDetails.Tilat += ` - ${dayType.name}: ${wainolaObj.text} - ${wainolaObj.duration}h`;
    } else if (locationType === 'haltia' && haltia) {
      const haltiaObj = getObjectInList('haltia', haltia);
      visitDetails.Tilat += ` - ${haltiaObj.fi} - ${haltiaObj.duration}h - ${haltiaObj.price} € + alv`;
    } else if (locationType === 'ilmanTiloja' && ilmanTiloja) {
      visitDetails.Tilat += ` - ${getObject('ilmanTiloja').price} € + alv`;
    } else if (villaParatiisi || villaParatiisiWeekend || villaParatiisiFullWeekend) {
      if (showAcommodationPrice) {
        const {
          villaPrice,
          cottagesPrices,
          acTitle,
          villaFirstNight,
          villaNextNights,
          cottageFirstNight,
          cottageNextNights,
        } = privatePersonAcommodationPrice();

        visitDetails[`${acTitle} ${villaPrice + cottagesPrices} € `] = [
          <i>Huvila</i>,
          villaFirstNight,
          villaNextNights,
          cottageFirstNight && <i>Lisähuoneet</i>,
          cottageFirstNight,
          cottageNextNights,
        ];
      } else {
        visitDetails[`Majoitus ${numOfNights} vuorokautta`] = [
          villaParatiisi && villaAcommodationTypes.villaParatiisi,
          villaParatiisiWeekend && villaAcommodationTypes.villaParatiisiWeekend,
          villaParatiisiFullWeekend && villaAcommodationTypes.villaParatiisiFullWeekend,
          cottagesAmount ? `${cottagesAmount} lisähuonetta` : undefined,
        ];
      }
    }
    visitDetails['Yrityksen nimi'] = data.companyName;

    return {
      basicInfo,
      food,
      activities,
      rentalEquipment,
      extraServices,
      visitDetails,
    };
  };

  const createMail = () => {
    if (isValid()) {
      const strDates = dateToStr(formData.from, formData.to);
      const title = `Tarjouspyyntö ${strDates}`;
      const description = `Tarjouspyyntö ajalle ${strDates} henkilöltä ${formData.name} `;
      const html = createHTML(createDataFields(), description, formData.moreInformation);
      const componentAsHtml = ReactDOMServer.renderToString(html);
      sendMail(formData.email, title, componentAsHtml);
    }
    window.scrollTo(0, 0);
  };

  const setType = (type) => {
    setFormData({ ...formData, type });
  };

  return (
    <div className="main">
      <Container style={{ margin: '40px 0', flexGrow: 1 }}>
        <SemanticForm style={{ margin: '0 5%' }} noValidate="novalidate">
          <Grid columns={4} centered stackable doubling>
            {[
              { text: 'Yritysasiakas', type: 'company' },
              { text: 'Yksityisasiakas', type: 'private' },
            ].map((customer) => (
              <Grid.Column key={customer.type}>
                <Button size="huge" active={formData.type === customer.type} onClick={() => setType(customer.type)}>
                  {customer.text}
                </Button>
              </Grid.Column>
            ))}
          </Grid>

          {formData.type && (
            <>
              <BasicDetails
                showWeekendPrices={showWeekendPrices}
                numOfNights={numOfNights}
                privatePersonAcommodationPrice={privatePersonAcommodationPrice}
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
                  {Object.keys(errors).map(
                    (errorKey) => errors[errorKey] && <Message.Content>{errors[errorKey]}</Message.Content>
                  )}
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
                    {reserveRightsToChanges}
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
    </div>
  );
};

export default Form;
