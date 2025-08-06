const data = [
  // {
  //   name: 'corog',
  //   config:
  //     '2.1,1.1,0.1,1.1,0.1,0.0,0.1,2.1,1.1,0.0,1.0,1.2,0.2,0.2,1.0,2.2,0.1,2.0,2.2,1.0,1.0,1.2,1.2,1.0,2.0,1.0,0.0,0.2,0.1,0.0,2.0,1.2,0.0,2.1,1.1,1.2,0.0,2.2,0.0,0.2,2.1,2.0,0.1,2.0,1.0,0.1,0.0,1.1,1.0,2.2,2.2,0.2,2.0,1.0,0.1,2.1,1.0,1.1,0.1,0.1,0.1,1.0|0.0,0.1,0.0,0.2,2.1,2.1,1.0,0.1,1.0,2.2,2.2,1.2,1.2,2.2,2.1,1.2,0.2,2.1,0.1,1.0,1.0,2.2,0.0,2.1,2.1,0.0,2.2,1.2,0.1,1.1,2.2,0.2,2.2,0.1,0.1,2.0,1.0,2.0,1.2,1.0,2.0,0.2,1.1,1.1,1.1,0.1,2.0,0.2,1.2,1.1,1.2,2.1,0.2,1.0,0.2,2.1,0.0,1.0,1.1,1.0,0.0,1.2',
  //   dataUrl:
  //     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAATCAYAAABLN4eXAAAAAXNSR0IArs4c6QAAAHtJREFUOE+tkjESgCAMBBO/obX+/zn2vkOdFHGOJBhB0tCw3LHAM68XNQ4Pg45zp2XaSFdbxCXZjRH4QHi6PdmmFlDmQ2CZop6k1UaB/9Bbiqa7ehbSy2PdKoSmrNFxIqRKdDc05+x1QV3vhEloL62nYNMvz/5fKOILdANK1GLnprnJWwAAAABJRU5ErkJggg==',
  // },
  // {
  //   name: 'test',
  //   config:
  //     '2.2,2.0,2.0,1.0,1.1,1.0,0.2,1.0,0.0,2.1,2.2,0.0,2.1,0.2,0.2,2.0,1.1,0.2,2.0,0.1,0.2,2.0,0.0,2.1,0.2,2.2,0.1,1.1,1.2,2.1,0.1,2.1,1.2,2.0,1.2,2.0,1.0,2.0,0.1,0.2,0.0,2.2,2.1,0.1,1.0,1.2,0.1,0.1,2.1,2.2,1.0,0.2,2.1,0.0,1.0,1.2,2.2,2.1,1.1,0.2,2.1,0.2,1.0,1.2,0.2,2.1,1.2,2.2,1.2,2.0,2.0,2.0,1.0,0.1,2.2,0.2,0.2,2.2,0.1,0.1,0.1,1.0,1.1,0.2,1.1,0.1,1.0,0.2,1.2,1.1,0.1,0.2,1.2,1.1,2.2,0.1,2.2,0.1,0.0|1.2,0.0,2.2,1.2,2.1,0.2,2.2,0.2,2.0,2.1,0.2,0.2,1.2,0.1,1.1,2.1,2.1,0.0,2.2,0.0,0.0,0.2,1.1,1.2,1.2,0.2,1.0,2.2,1.0,2.1,2.0,1.0,2.0,1.2,1.0,1.2,1.2,2.2,1.2,1.1,1.0,2.0,1.0,0.2,0.0,2.0,1.0,1.2,2.1,2.2,1.2,1.0,1.0,1.1,0.0,2.0,1.0,0.1,1.1,1.2,2.2,1.2,2.1,2.0,2.0,2.1,1.0,2.2,0.0,1.2,0.1,2.2,0.2,1.2,2.0,1.0,2.1,2.0,2.1,2.0,1.2,0.1,0.1,2.0,0.2,1.2,1.1,1.0,0.1,2.0,2.0,1.1,1.1,2.1,2.2,2.2,1.2,1.0,1.0',
  //   dataUrl:
  //     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAYCAYAAABjswTDAAAAAXNSR0IArs4c6QAAARVJREFUWEfllkESwjAIRRuvUdd6/+O47znUyQIHEQh8Yp2O2TVNyuvnE9LWdnksBxntL2C3+205n67pnKD7eiBIWQqYDYzuI0UgWC5nFDi6zksVDNuD98GtIIG0Z7kn46MSbAflqdXgaa5qAdizfSMpK5WRSmvKIYUJw1qglrKzgEs2yPiNr91VWcsG5GECk898HvlRWFnPtx4IqirsWYLxiixSgFl1pyhrpVuzw0+UHZ0Io/dZVcs24L71FNO63W6wPHi053udLgo+9Kxsk5Wg2k9m2vAHrEyZ9F6lQKSC1rct27zBairKip4NazUSfkkihhesdZ2b0SY9T2qnhnXtND07q4KjxRM5WYYFlgn27bWHgn0CPzPkMTC4zLgAAAAASUVORK5CYII=',
  // },
  // {
  //   name: 'tall',
  //   config:
  //     '0.1,1.1,1.0,1.2,1.2,1.2,2.2,0.0,0.1,0.0,0.0,1.0,0.1,2.2,2.1,0.2,0.0,1.2,1.1,0.1,0.1,1.0,1.0,2.0,2.0,2.1,1.0,1.1,0.0,0.2,0.1,1.0,0.0,1.0,0.1,2.0,2.1,2.1,0.0,0.2,2.1,2.0,2.0,1.1,1.1,0.1,0.2,2.2,1.1,1.0,0.1,1.2,2.2,1.1,2.1,2.2,1.0,0.1,1.0,1.2,2.2,1.2,0.2,2.1,2.1,1.0,0.0,1.1,0.1,1.1,2.1,0.2,2.0,0.2,1.2,1.1,0.0,0.1,0.2,1.2,0.0,0.1,1.1,1.2,0.1,1.1,1.2,0.1,0.2,0.2,0.1,0.2,0.0,1.1,1.0,2.0,0.2,1.1,2.1,0.2|0.1,0.0,2.0,0.1,1.2,2.0,1.0,2.1,0.2,1.2,0.2,1.2,0.1,1.0,1.2,2.0,0.2,0.0,0.2,1.2,0.1,2.0,1.2,1.0,1.2,0.0,1.0,1.1,2.0,1.1,0.0,1.0,1.1,0.0,0.2,2.0,2.2,1.1,2.2,1.0,0.0,0.0,1.1,1.2,0.1,2.0,2.2,2.1,0.2,1.0,1.0,1.1,1.2,0.1,0.2,0.0,0.2,2.2,2.1,2.2,2.0,0.2,2.0,1.1,0.2,0.1,2.0,0.0,0.0,1.0,2.1,2.0,0.0,2.0,0.2,1.2,1.1,1.2,1.1,1.2,2.2,2.2,1.2,0.1,0.1,1.1,1.2,2.2,0.2,1.2,0.2,2.2,2.0,0.2,1.2,1.1,2.2,1.0,0.1,2.2',
  //   dataUrl:
  //     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAdCAYAAAB1yDbaAAAAAXNSR0IArs4c6QAAALRJREFUOE+9VUEOgDAIc35Dz/r/53j3HWpmgkHWjmWbehwUChQMU1jOofILXcH7sd085nF9+KC3aHxljk4RJM66GnnXQRPaGmgDaWCS2fZNmLB+0oZZBihAlrYFuLRRsySIC46OtlZWO6WtR1M8Z0+pxXP+t2FIokiaUGFN8mzKLHOWtWRjorTRNiGhwMXQ2YozW12jwwBFklsIJpbvVrLqDLEDaOn3O4C5sSBb3z+Gdwy0/QLzIKt7hDtZzAAAAABJRU5ErkJggg==',
  // },
  // {
  //   name: 'blob',
  //   config:
  //     '2.0,2.1,0.2,2.0,1.2,1.0,0.0,0.1,0.1,2.0,2.0,0.2,1.1,1.2,2.2,1.2,0.1,1.0,2.2,1.0,2.1,0.0,2.0,1.1,1.0,1.0,1.1,2.1,1.1,0.1,2.1,0.1,0.2,1.1,0.0,2.2,2.0,2.2,0.2,2.0,2.1,0.0,2.0,2.1,0.0,0.0,0.2,2.0,1.1,1.0,0.2,1.0,2.2,1.1,2.1,1.1,1.0,1.1,2.1,0.2,2.2,1.2,0.0,0.0|1.2,0.2,1.0,2.1,2.2,2.0,1.1,2.0,1.0,0.0,0.1,0.2,0.1,2.1,2.0,1.0,2.1,2.0,2.2,1.0,2.2,0.2,2.2,2.1,2.2,0.1,2.1,2.2,0.2,2.2,1.0,0.2,1.0,0.2,1.0,1.1,1.2,2.0,2.1,2.1,1.0,1.0,2.0,1.1,1.0,2.1,2.2,1.1,0.0,2.1,0.2,2.0,2.0,0.2,1.2,1.1,1.0,2.2,0.1,1.1,2.2,2.2,0.1,1.0',
  //   dataUrl:
  //     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAMCAYAAACEJVa/AAAAAXNSR0IArs4c6QAAAF5JREFUOE9jlGZU+89AIWCkmSFP/t1kkGFSx3AfLnGsLgEpBgFkg7CJwWzBMARmG0wTsnNAhmJzDYoh2DTiCnNkV8INIcUAmMEwgwapS2DORA5c5MAkKYpJTcBUSbEAz+48GXVIGFoAAAAASUVORK5CYII=',
  // },
  // {
  //   name: 'tongue',
  //   config:
  //     '1.1,2.1,2.0,2.2,2.1,2.1,2.0,2.2,1.0,1.1,2.0,2.2,1.0,1.0,0.2,0.0,1.0,2.0,2.1,1.2,0.0,1.1,1.2,2.2,0.2,0.2,1.1,1.0,0.2,1.2,1.0,0.1,2.2,1.1,1.0,2.1,0.2,2.1,2.0,1.2,0.0,0.1,2.0,0.2,1.1,2.2,2.1,1.1,0.1,0.0,1.1,0.1,1.2,0.0,2.1,1.1,0.0,2.2,1.0,2.2,0.1,2.0,2.2,1.0,1.0,1.0,2.0,1.1,1.2,2.2,1.0,0.2,1.1,0.1,0.2,1.2,1.1,0.1,0.2|0.0,2.1,2.2,1.0,1.1,1.2,0.2,0.0,1.1,0.2,1.1,2.2,1.1,2.2,1.2,0.0,0.2,1.1,0.1,2.1,1.2,2.0,2.0,1.1,0.2,2.1,0.1,1.2,1.0,2.0,1.1,2.1,1.0,0.1,1.1,1.0,1.2,0.1,2.2,0.0,1.1,0.1,0.1,1.0,1.0,0.1,2.1,2.2,0.1,0.1,1.0,0.1,2.1,0.2,2.2,0.0,0.2,1.1,0.1,1.1,1.1,1.0,1.2,2.1,1.1,0.0,0.0,0.2,2.0,2.1,2.0,1.0,2.2,0.1,1.1,0.1,2.1,1.2,1.0',
  //   dataUrl:
  //     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAYCAYAAAALQIb7AAAAAXNSR0IArs4c6QAAAPtJREFUSEvNVUEOwjAMa/kGnOH/z9mddwDqIcjz3MSV0EQvjC6Zk9hJ+rXf3+2k0/8K7Pna2u3yaON3nPEcB+/CLiuSlRkCMlgEgvczQBsMP4CZxv3PwLBsmIlTOgzSymw4BD/BG/93BL0ExuVb4WsEY4FV5areR9YlmJI8l8yxsTJzo3bs0szciFFAWQtMwVBtrECeKMpWqdPmrGpqHmXLYMiD02cVbzZnFZjD7w6MHXiq4xycgYdAFPgXjEuQCaTiT22GQ5/NMkHy1UyslHuYIOygolc9xMtVqTD8dmVUE93ZVypQtd3Tpkays8nALTKzLZva2VOuzalgHxNG6jHxUI07AAAAAElFTkSuQmCC',
  // },
  // {
  //   name: 'house',
  //   config:
  //     '0.0,0.2,1.2,0.0,0.0,2.1,1.0,1.0,1.0,0.0,2.0,0.1,0.1,1.1,0.0,2.0,2.0,1.2,2.1,1.1,2.0,1.1,2.1,0.2,2.2,2.1,1.0,0.2,1.1,0.0,0.1,2.1,0.0,1.0,0.2,1.2,0.1,2.2,0.0,2.2|0.2,1.1,0.0,2.0,1.2,2.1,2.1,1.2,0.0,2.0,1.1,2.2,0.1,2.1,2.0,1.1,2.1,1.0,2.2,2.1,2.0,2.0,2.0,2.2,0.2,0.2,0.0,0.1,0.1,1.0,1.0,0.0,0.0,1.1,1.2,0.0,2.2,2.1,0.1,0.0',
  //   dataUrl:
  //     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAPCAYAAAA/I0V3AAAAAXNSR0IArs4c6QAAAB1JREFUOE9jlGZU+89AImAc1QQJsdGAgKac4RgQAAB3Et9Y+7CBAAAAAElFTkSuQmCC',
  // },
  // {
  //   name: 'spodge',
  //   config:
  //     '0.2,1.2,2.0,1.2,0.0,0.0,1.2,2.2,1.2,2.0,2.1,2.0,2.1,1.2,1.2,2.0,1.2,1.1,1.0,1.2,0.2,1.2,0.0,0.1,0.2,0.2,2.2,2.0,0.0,0.0,2.1,1.2,0.2,1.0,1.1,2.0,0.2|0.0,0.0,0.0,1.1,0.1,2.0,0.0,2.0,0.0,1.1,0.2,2.0,2.0,1.0,0.1,2.1,0.0,2.2,2.0,1.1,0.2,1.1,0.1,0.0,2.0,1.0,2.2,1.1,2.2,1.2,1.2,1.2,0.1,1.1,2.2,2.0,1.0',
  //   dataUrl:
  //     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAMCAYAAACA0IaCAAAAAXNSR0IArs4c6QAAAB9JREFUOE9jlGZU+89AJcA4ahjJITkaZiQHGcMICTMAUTcPGZhRFuIAAAAASUVORK5CYII=',
  // },
  // {
  //   name: 'cat',
  //   config:
  //     '1.1,2.0,1.0,0.0,0.0,0.2,0.2,0.1,0.1,0.2,2.0,1.1,2.1,0.1,1.0,0.0,1.2,0.0,2.0,2.2,0.2,0.2,2.1,1.2,2.1,2.2,0.0,2.1,2.1,0.0,1.1,1.2,2.2,2.2,1.0,2.1,2.1,1.2,1.1,2.0,1.2,0.2,2.2,0.2,0.0,2.1,0.0,0.0,1.1,1.2,0.2,1.1,0.0,1.0,1.1,1.2,0.0,0.1,2.0,0.1,0.1,2.0,2.2,2.1,2.0,2.0,1.2,0.2,0.2,1.1,1.0,2.1,0.0,2.2,1.1,2.2,2.0|0.1,0.1,2.2,1.2,0.2,2.1,0.0,1.2,2.2,0.2,2.1,2.1,2.2,0.2,2.1,2.2,2.2,0.2,2.0,0.2,2.1,2.1,1.2,0.1,0.2,0.1,0.1,1.2,1.0,1.1,2.0,0.1,2.0,2.1,0.1,2.2,2.1,2.0,1.1,1.0,1.2,2.0,1.0,1.2,2.0,1.2,2.2,1.2,1.1,2.2,1.2,0.1,2.2,1.0,2.1,1.2,2.1,2.1,1.0,2.0,0.1,1.2,1.0,1.1,0.1,2.0,2.1,2.2,0.1,0.1,1.1,2.1,0.1,0.1,2.1,2.2,2.2',
  //   dataUrl:
  //     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAaCAYAAABctMd+AAAAAXNSR0IArs4c6QAAAOVJREFUSEvNVUkSwjAMS/hGOcP/n8OddxTGBzOqKi8M06G5dLJYVmQ5ncu8vcZBY54C/Lk+xvVyH/7tXLbN/DBwZttlXzKPgDoJ/gtuhTu/LMbQhlkOGUfMcZ1jLX6jOdqNfewJPanaZxIfcM/caY7qjBPZMfdA70aXCZNXe46xs6LSXSXk2uA8BEdNUedIClXIFrhig0lYKiYgO5SLq27QOdNqf75BJgWyb4NHrslsKd2CVsPgap3lC62oQPFPpJouBY8CsrcleyZS5sw0mmOTpQVV3s0kyLxeuqV6pL5yyy9gHPsGxx7jtd821qcAAAAASUVORK5CYII=',
  // },
  // {
  //   name: '',
  //   config: '',
  //   dataUrl: '',
  // },
]
const saveDataName = 'ma5a_invdr_generated_data'

export { data, saveDataName }
