const { Patsiendid, Klient, Liik, Visiit, Haiguslood, T99tajad, Spetsialiseerumine } = require('./models');
const faker = require('faker');

async function seed() {
  // Create Liik (Species)
  const liigid = [];
  for (let i = 0; i < 5; i++) {
    liigid.push(await Liik.create({ Nimetus: faker.animal.type() }));
  }

  // Create Klient (Clients)
  const kliendid = [];
  for (let i = 0; i < 10; i++) {
    kliendid.push(await Klient.create({
      Eesnimi: faker.name.firstName(),
      Perekonnanimi: faker.name.lastName(),
      Isikukood: faker.datatype.uuid(),
      Telefoninr: faker.phone.phoneNumber(),
      Epost: faker.internet.email(),
      Elukoht: faker.address.city()
    }));
  }

  // Create Patsiendid (Patients)
  for (let i = 0; i < 20; i++) {
    await Patsiendid.create({
      Nimi: faker.name.firstName(),
      Vanus: faker.datatype.number({ min: 1, max: 15 }),
      Tõug: faker.animal.dog(),
      Steriliseerimine: faker.datatype.boolean(),
      LiikID: faker.random.arrayElement(liigid).LiikID,
      KlientID: faker.random.arrayElement(kliendid).KlientID
    });
  }

  // Add more fake data for other models as needed
  console.log('Fake data seeded!');
}

seed().then(() => process.exit());
