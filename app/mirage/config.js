export default function() {
    this.get('/holidays', function() {
        return {
          data: [
            {
              type: 'holidays',
              id: 1,
              attributes: {
                id: 1,
                title: 'День зимы',
                date: '1454450400', // 03 Feb 2016
                type: 1
              }
            },
            {
              type: 'holidays',
              id: 2,
              attributes: {
                id: 2,
                title: 'День растрат',
                date: '1457388000', // 08 Mar 2016
                type: 2
              }
            },
            {
              type: 'holidays',
              id: 3,
              attributes: {
                id: 3,
                title: 'День черепахи',
                date: '1458252000', // 18 Mar 2016
                type: 3
              }
            },
            {
              type: 'holidays',
              id: 4,
              attributes: {
                id: 4,
                title: 'День весны',
                date: '1456802400', // 1 Mar 2016
                type: 1
              }
            },
            {
              type: 'holidays',
              id: 5,
              attributes: {
                id: 5,
                title: 'День отличника',
                date: '1457159400', // 5 Mar
                type: 2
              }
            },
            {
              type: 'holidays',
              id: 6,
              attributes: {
                id: 6,
                title: 'День сибирских пельменей',
                date: '1461126000', // 20 April
                type: 3
              }
            },
            {
              type: 'holidays',
              id: 7,
              attributes: {
                id: 7,
                title: 'День ленивых вареников',
                date: '1461308400', // 22 April
                type: 1
              }
            },
            {
              type: 'holidays',
              id: 8,
              attributes: {
                id: 8,
                title: 'День тюленя',
                date: '1461382200', // 23 April
                type: 2
              }
            },
            {
              type: 'holidays',
              id: 9,
              attributes: {
                id: 9,
                title: 'День пионера',
                date: '1461632700', // 26 April
                type: 3
              }
            },
            {
              type: 'holidays',
              id: 10,
              attributes: {
                id: 10,
                title: 'День календаря',
                date: '1461802800', // 28 April
                type: 1
              }
            },
            {
              type: 'holidays',
              id: 11,
              attributes: {
                id: 11,
                title: 'День безделья ',
                date: '1462057200', // 30 April
                type: 2
              }
            },
          ]
        };
    });
}

/*
You can optionally export a config that is only loaded during tests
export function testConfig() {

}
*/
