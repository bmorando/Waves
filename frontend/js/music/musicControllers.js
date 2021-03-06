(function() {
  angular.module('wavesApp')
    .controller("MusicListController", MusicListController)
    .controller("MusicShowController", MusicShowController)
    .controller("MusicNewController", MusicNewController)
    .controller("MusicEditController", MusicEditController);


    MusicListController.$inject = ['MusicResource', '$sce'];
    MusicShowController.$inject = ['MusicResource', '$stateParams'];
    MusicNewController.$inject  = ['MusicResource', '$state'];
    MusicEditController.$inject = ['MusicResource', '$stateParams', '$state'];


    function MusicListController(MusicResource, $sce) {
      var vm = this;
      vm.musics = [];
      vm.musicplayerFunction = musicplayerFunction;
      vm.musicstoperFunction = musicstoperFunction;
      vm.musicSrc = musicSrc

      MusicResource.query().$promise.then(function(musics) {
        vm.musics = musics;
        vm.musics.forEach(function (music) {
          music.playing = false
        })
      });

      function musicplayerFunction(i) {
         // var i = $(event.target).data().index
          for(var j = 0; j < vm.musics.length; j++) {
              vm.musics[j].playing = false;
          }
          vm.musics[i].playing = true
          // console.log("playing song");
      }
       function musicstoperFunction(i) {
         vm.musics[i].playing = false
      }
      function musicSrc(music) {
        song_url = music.song_url;
        // console.log(song_url)
        var newSong = song_url.split('v=')[1].split('&')[0];
        // console.log(newSong)
        var player = "https://www.youtube.com/embed/" + newSong;
        // console.log(player)
        if (music.playing) {
          player += "?autoplay=1";
        }
        return $sce.trustAsResourceUrl(player);
      }
    }

    function MusicShowController(MusicResource, $stateParams) {
      var vm = this;
      vm.music = {};

       MusicResource.get({id: $stateParams.id}).$promise.then(function(jsonMusic) {
            vm.music = jsonMusic;
      });
    }

    function MusicNewController(MusicResource, $state) {
      var vm = this;
      vm.newMusic = {};
      vm.addMusic = addMusic;

      function addMusic() {
        MusicResource.save(vm.newMusic).$promise.then(function(jsonMusic) {
          vm.newMusic = {};
          $state.go('musicShow', {id: jsonMusic.id});
        });
      }
    }

    function MusicEditController(MusicResource, $stateParams, $state) {
      var vm = this;
      vm.music = {};
      vm.editMusic = editMusic;

      MusicResource.get({id: $stateParams.id}).$promise.then(function(jsonMusic) {
          vm.music = jsonMusic;
      });

      function editMusic() {
        MusicResource.update({id: vm.music.id}, vm.music).$promise.then(function(updatedMusic) {
          vm.music = updatedMusic;
          $state.go('musicShow', {id: updatedMusic.id});
        });
      }
    }
})();
