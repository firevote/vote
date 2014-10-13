<?php
  class ado_fb_res extends spModel {
      function getRes($skip,$limit) {
          $res = spClass("m_fb_res");
          $ret = $res->spPager(1,10)->findAll();
          $pager = $res->spPager()->getPager();
          
          $retArr = Arrar();
          
          array_push($retArr, $ret);
          array_push($retArr,$pager);
          
          return $retArr;
      }
  }
?>
